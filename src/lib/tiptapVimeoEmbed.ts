import { mergeAttributes, Node, nodePasteRule } from '@tiptap/core';

const VIMEO_URL_RE = /^https:\/\/(www\.)?vimeo\.com\/(\d+)(?:\?.*)?(?:#.*)?$/;

function canonicalVimeoSrc(url: string): string | null {
  const m = url.trim().match(VIMEO_URL_RE);
  return m?.[2] ? `https://vimeo.com/${m[2]}` : null;
}

function embedUrlFromStoredSrc(stored: string | null): string | null {
  if (!stored) return null;
  const idMatch = stored.match(/(\d+)\s*$/);
  const id = idMatch?.[1] ?? canonicalVimeoSrc(stored)?.match(/\d+$/)?.[0];
  return id ? `https://player.vimeo.com/video/${id}` : null;
}

/**
 * Block embed for Vimeo watch URLs. Renders a div[data-vimeo-video] wrapper to match YouTube embed layout.
 */
export const VimeoEmbed = Node.create({
  name: 'vimeoEmbed',
  group: 'block',
  atom: true,
  draggable: true,
  addOptions() {
    return {
      HTMLAttributes: {} as Record<string, string | number | boolean | undefined>,
    };
  },
  addAttributes() {
    return {
      src: { default: null as string | null },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-vimeo-video]',
        getAttrs: (node) => {
          const iframe = (node as HTMLElement).querySelector('iframe');
          const src = iframe?.getAttribute('src') ?? '';
          const match = src.match(/player\.vimeo\.com\/video\/(\d+)/);
          const id = match?.[1];
          return id ? { src: `https://vimeo.com/${id}` } : false;
        },
      },
    ];
  },
  addPasteRules() {
    return [
      nodePasteRule({
        find: /https:\/\/(www\.)?vimeo\.com\/\d+/g,
        type: this.type,
        getAttributes: (match) => {
          const canon = canonicalVimeoSrc(match[0]);
          return canon ? { src: canon } : false;
        },
      }),
    ];
  },
  renderHTML({ HTMLAttributes }) {
    const embedHref = embedUrlFromStoredSrc(HTMLAttributes.src);
    if (!embedHref) {
      return ['div', { 'data-vimeo-video': '' }];
    }

    return [
      'div',
      { 'data-vimeo-video': '' },
      [
        'iframe',
        mergeAttributes(
          {
            src: embedHref,
            width: 640,
            height: 360,
            frameborder: 0,
            allowfullscreen: 'true',
            allow: 'autoplay; fullscreen; picture-in-picture',
            loading: 'lazy',
            title: 'Embedded Vimeo video',
          },
          this.options.HTMLAttributes
        ),
      ],
    ];
  },
});
