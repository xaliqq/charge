// BANNER //

interface ICarrerBannerShared {
  titleAz: string;
  titleEn: string;
  titleRu: string;
}
interface IGetCareerBannerItem extends ICarrerBannerShared {
  id: number;
  imageUrl: null | string;
}
interface IUpdateCareerBannerItem extends ICarrerBannerShared {
  photo?: null | string | File;
}

// HEADER //

interface ICareerHeaderPayload {
  firstHeader: {
    title: string;
    description: string;
  };
  secondHeader: {
    title: string;
    description: string;
  };
  languageId: number;
}

// LIST //
interface ICareerListPayload {
  title: string;
  descriptions: string[];
  photo: File;
  LanguageId: number;
}
interface ICareerListShared {
  id: number | string;
  languageId: number;
  careerContentBoxId: number;
}
interface ICareerListTitle extends ICareerListShared {
  title: string;
}
interface ICareerListDescription extends ICareerListShared {
  description: string;
}

interface ICareerListItem {
  id: number;
  imageUrl: string;
  isActive: boolean;
  titles: ICareerListTitle[];
  careerContentDescriptions: ICareerListDescription[];
}

export type {
  IGetCareerBannerItem,
  ICareerListItem,
  ICareerListDescription,
  ICareerListTitle,
  ICareerListPayload,
  ICareerHeaderPayload,
  IUpdateCareerBannerItem
};
