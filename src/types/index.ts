export interface Post {
  id: string;
  title: string;
  slug: string;
  content: Record<string, unknown>;
  excerpt: string | null;
  cover_image: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Attachment {
  id: string;
  post_id: string;
  file_name: string;
  file_url: string;
  file_type: string | null;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  live_url: string | null;
  github_url: string | null;
  cover_image: string | null;
  display_order: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  category: string;
  name: string;
  proficiency: number;
  display_order: number;
  created_at: string;
}

export interface SiteSetting {
  key: string;
  value: unknown;
  updated_at: string;
}

export interface SiteSettings {
  hero_title?: string;
  hero_subtitle?: string;
  about_text?: string[];
  about_stats?: { label: string; value: string }[];
  social_github?: string;
  social_linkedin?: string;
  social_twitter?: string;
}
