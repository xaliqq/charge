import { selectOption } from './common';

interface IWebElevenItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  languageId: selectOption | number;
  isActive: boolean;
}

export type { IWebElevenItem };
