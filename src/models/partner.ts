interface IPartnersItem {
  owner: {
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
  };
  name: string;
  taxId: string;
  id?: number;
  percentage: number;
  chargePoints: {
    name: string;
  }[];
}

export type { IPartnersItem };
