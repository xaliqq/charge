interface IPostSlider {
  Photo: File;
}
interface IPostSliderResponse {
  az: File[];
  en: File[];
  ru: File[];
}
interface ISliderListItem {
  id: number;
  isActive: boolean;
  languageId: number;
  photo: string;
}
export type { IPostSlider, ISliderListItem, IPostSliderResponse };
