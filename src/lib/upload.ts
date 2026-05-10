import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getStorageInstance } from './firebase';
import { makeBlogCoverBlobs } from './imageResize';

export const uploadImage = async (file: File, folder: string = 'blog'): Promise<string> => {
  const fileName = `${Date.now()}-${file.name}`;
  const storageRef = ref(getStorageInstance(), `${folder}/${fileName}`);

  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
};

function safeStem(originalName: string): string {
  return originalName
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 72) || 'cover';
}

/**
 * Upload optimized hero + listing thumbnail for blog covers (small grid loads the thumb URL).
 */
export async function uploadBlogCoverImages(
  file: File,
  folder = 'blog-covers'
): Promise<{ fullUrl: string; thumbnailUrl: string | null }> {
  const stem = `${Date.now()}-${safeStem(file.name)}`;
  const { full, thumbnail } = await makeBlogCoverBlobs(file);

  if (full && thumbnail) {
    const fullRef = ref(getStorageInstance(), `${folder}/${stem}-full.jpg`);
    const thumbRef = ref(getStorageInstance(), `${folder}/${stem}-thumb.jpg`);
    await uploadBytes(fullRef, full, { contentType: 'image/jpeg' });
    await uploadBytes(thumbRef, thumbnail, { contentType: 'image/jpeg' });
    const [fullUrl, thumbnailUrl] = await Promise.all([
      getDownloadURL(fullRef),
      getDownloadURL(thumbRef),
    ]);
    return { fullUrl, thumbnailUrl };
  }

  const originalRef = ref(getStorageInstance(), `${folder}/${stem}-original`);
  await uploadBytes(originalRef, file);
  const fullUrl = await getDownloadURL(originalRef);
  return { fullUrl, thumbnailUrl: null };
}
