
export interface Story {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  content?: string;
  isGeneratingContent?: boolean;
}
