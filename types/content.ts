export type ContentType = "articles" | "faqs" | "homeContent";

export interface Article {
  _id?: string; // Optional because new articles don't have IDs yet
  title: string;
  content: string;
  status: string;
  image?: string; // ADD THIS LINE (The '?' makes it optional)
  createdAt?: string;
}

export interface FAQ {
  _id?: string;
  question: string;
  answer: string;
}

export interface HomeContent {
  _id?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
}

export interface MutationPayload {
  type: ContentType;
  id?: string;
  title?: string;
  content?: string;
  image?: string; // ADD THIS LINE
  status?: string;
  question?: string;
  answer?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
}