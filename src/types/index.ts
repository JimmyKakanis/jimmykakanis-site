export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string | null;
  /** Smaller JPEG for blog grid / admin lists; omit for legacy posts — UI falls back to coverImage */
  coverImageThumbnail?: string | null;
  status: 'draft' | 'published';
  publishedAt: any;
  updatedAt: any;
  tags: string[];
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  image: string;
  /** If set (valid URL), project cards open this in a new tab; otherwise `/projects/:id` */
  link?: string | null;
  order: number;
  status: 'draft' | 'published';
}
