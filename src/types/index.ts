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
  created_at: string;
}
