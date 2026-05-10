/**
 * One-off migration: downloads each post coverImage, builds a 512×512 centre-cropped JPEG
 * thumbnail, uploads next to existing covers in Storage, writes coverImageThumbnail on Firestore.
 *
 * Prereqs (see Firebase Console → Project settings → Service accounts):
 * - Either set GOOGLE_APPLICATION_CREDENTIALS to a downloaded service-account JSON path, or
 * - Set FIREBASE_SERVICE_ACCOUNT_JSON to the JSON string contents, or
 * - Run "gcloud auth application-default login" locally so application-default credentials exist.
 *
 * Reads VITE_FIREBASE_STORAGE_BUCKET / VITE_FIREBASE_PROJECT_ID from .env (same as the Vite app),
 * unless overridden with STORAGE_BUCKET / GCLOUD_PROJECT.
 *
 * Usage:
 *   npx tsx scripts/backfill-cover-thumbnails.ts [--dry-run] [--force]
 *
 *   --dry-run   Log actions only (no uploads or Firestore updates)
 *   --force     Regenerate thumbnails even when coverImageThumbnail is already set
 */

import crypto from 'node:crypto';
import path from 'node:path';

import dotenv from 'dotenv';
import { cert, initializeApp, getApps, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import sharp from 'sharp';

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local', override: true });

const credQuoted = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
if (credQuoted?.startsWith('"') && credQuoted.endsWith('"')) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credQuoted.slice(1, -1).trim();
}
const credRaw = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
if (credRaw && !path.isAbsolute(credRaw)) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(process.cwd(), credRaw);
}

const dryRun = process.argv.includes('--dry-run');
const force = process.argv.includes('--force');

const bucketName =
  process.env.VITE_FIREBASE_STORAGE_BUCKET ??
  process.env.FIREBASE_STORAGE_BUCKET ??
  process.env.STORAGE_BUCKET;
const projectId =
  process.env.VITE_FIREBASE_PROJECT_ID ??
  process.env.FIREBASE_PROJECT_ID ??
  process.env.GCLOUD_PROJECT;

function initAdmin() {
  if (getApps().length > 0) return;

  if (!bucketName) {
    console.error(
      'Missing bucket: set VITE_FIREBASE_STORAGE_BUCKET (or STORAGE_BUCKET / FIREBASE_STORAGE_BUCKET) in .env.'
    );
    process.exit(1);
  }

  const jsonCred = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();

  initializeApp({
    credential: jsonCred?.length ? cert(JSON.parse(jsonCred) as Parameters<typeof cert>[0]) : applicationDefault(),
    projectId,
    storageBucket: bucketName,
  });
}

async function thumbnailFromBuffer(buffer: Buffer): Promise<Buffer> {
  const img = sharp(buffer).rotate();
  const meta = await img.metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  if (!w || !h) throw new Error('Could not read image dimensions');

  const side = Math.min(w, h);
  const left = Math.floor((w - side) / 2);
  const top = Math.floor((h - side) / 2);

  return img
    .extract({ left, top, width: side, height: side })
    .resize(512, 512)
    .jpeg({ quality: 85 })
    .toBuffer();
}

function gcsDownloadUrl(objectPath: string, token: string, bucket: string): string {
  const enc = encodeURIComponent(objectPath).replace(/\(/g, '%28').replace(/\)/g, '%29');
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${enc}?alt=media&token=${token}`;
}

async function uploadThumbnailJpeg(bucketParam: string, buffer: Buffer, objectPath: string): Promise<string> {
  const file = getStorage().bucket(bucketParam).file(objectPath);
  const token = crypto.randomUUID();
  await file.save(buffer, {
    resumable: false,
    metadata: {
      contentType: 'image/jpeg',
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
  });
  const [meta] = await file.getMetadata();
  const customMeta = meta.metadata ?? {};
  const persistedToken = typeof customMeta.firebaseStorageDownloadTokens === 'string'
    ? customMeta.firebaseStorageDownloadTokens.split(',').filter(Boolean)[0]?.trim()
    : undefined;
  const effectiveToken = persistedToken ?? token;
  const urlBucketId = file.bucket.name;
  return gcsDownloadUrl(objectPath, effectiveToken, urlBucketId);
}

async function main() {
  initAdmin();

  const db = getFirestore();

  const snap = await db.collection('posts').get();

  console.log(`Found ${snap.size} post documents.`);
  if (dryRun) console.log('DRY RUN — no writes');

  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for (const doc of snap.docs) {
    const d = doc.data();
    const id = doc.id;
    const coverImage = typeof d.coverImage === 'string' ? d.coverImage.trim() : '';
    const thumb = typeof d.coverImageThumbnail === 'string' ? d.coverImageThumbnail.trim() : '';

    if (!coverImage) {
      skipped++;
      continue;
    }

    if (thumb && !force) {
      console.log(`[skip ${id}] already has thumbnail`);
      skipped++;
      continue;
    }

    const safeId = id.replace(/[^a-zA-Z0-9_-]+/g, '-');
    const title = typeof d.title === 'string' ? d.title : id;
    console.log(`${dryRun ? '[dry-run] ' : ''}[${title}]`);

    try {
      const response = await fetch(coverImage, { signal: AbortSignal.timeout(120_000) });
      if (!response.ok) throw new Error(`HTTP ${response.status} fetching cover`);
      const buffer = Buffer.from(await response.arrayBuffer());

      let thumbBuf: Buffer;
      try {
        thumbBuf = await thumbnailFromBuffer(buffer);
      } catch (e) {
        throw new Error(`Sharp could not resize (unsupported format?): ${String(e)}`);
      }

      const stamp = Date.now();
      const objectPath = `blog-covers/migrate-${safeId}-${stamp}-thumb.jpg`;

      if (dryRun) {
        console.log(`  would upload → ${bucketName}/${objectPath} (${thumbBuf.byteLength} bytes)`);
      } else {
        const thumbUrl = await uploadThumbnailJpeg(bucketName!, thumbBuf, objectPath);
        await doc.ref.update({ coverImageThumbnail: thumbUrl });
        console.log(`  uploaded & updated thumbnail`);
      }
      ok++;
    } catch (e) {
      failed++;
      console.error(`  ERROR: ${String(e)}`);
    }
  }

  const modeLine = dryRun ? `planned_ok=${ok} (no writes)` : `updated_posts=${ok}`;
  console.log(`\nSummary: ${modeLine} skipped=${skipped} failed=${failed}`);
  process.exit(failed > 0 && !dryRun ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
