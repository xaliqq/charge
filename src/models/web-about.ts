import { selectOption } from './common';

interface IWebAboutItem {
  id: number;
  title: string;
  description: string;
  year: string;
  imageUrl: string;
  languageId: selectOption | number;
  isActive: boolean;
}

export type { IWebAboutItem };
