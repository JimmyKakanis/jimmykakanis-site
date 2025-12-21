export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string | null;
  publishedAt: any;
  updatedAt: any;
  tags: string[];
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  image: string;
  link: string;
  order: number;
}
