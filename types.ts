export type CardType = 'featured' | 'testimonial';

export interface CardData {
  id: string;
  type: CardType;
  description: string; // Used for content/quote
  imageUrl: string;
  
  // Featured specific
  tag?: string;
  url?: string;
  linkText?: string;
  linkOnNewLine?: boolean;

  // Testimonial specific
  authorName?: string;
  authorRole?: string;
}

export interface ProcessingResult {
  html: string;
}