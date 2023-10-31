interface ICategoryItem {
  id: number;
  nameAz: string | null;
  nameEn: string | null;
  nameRu: string | null;
  descriptionAz?: string | null;
  descriptionEn?: string | null;
  descriptionRu?: string | null;
  isActive: boolean;
}

interface ICategoryUptade {
  id: number | null;
  nameAz: string | null;
  nameEn: string | null;
  nameRu: string | null;
  descriptionAz?: string | null;
  descriptionEn?: string | null;
  descriptionRu?: string | null;
}

export type { ICategoryItem, ICategoryUptade };
