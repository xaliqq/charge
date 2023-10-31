interface IProductItem {
  id: number;
  nameAz: string | null;
  nameEn: string | null;
  nameRu: string | null;
  descriptionAz: string | null;
  descriptionEn: string | null;
  descriptionRu: string | null;
  price: number | null;
  imageUrl: string | null;
  category: {
    id: number;
    name: string;
  };
  isActive: boolean;
}

interface ICategoryList {
  id: number;
  name: string;
}

interface IProductUptade {
  id: number | undefined;
  nameAz: string | undefined;
  nameEn: string | undefined;
  nameRu: string | undefined;
  descriptionAz?: string | undefined;
  descriptionEn?: string | undefined;
  descriptionRu?: string | undefined;
}

export type { IProductItem, ICategoryList, IProductUptade };
