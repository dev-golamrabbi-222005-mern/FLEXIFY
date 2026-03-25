export type ContentType = "articles" | "faqs" | "homeContent";

export interface Article {
  _id?: string;
  title: string;
  content: string;
  status: "Published" | "Draft";
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
  status?: string;
  question?: string;
  answer?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
}