interface IUser {
  id: string;
  firstname: string;
  lastname: string;
  gender: number;
  phoneNumber: string;
  email: string;
  birthday: string;
}

interface IOrderModifiers {
  id: number;
  minQuantity: number;
  maxQuantity: number;
  modifierItem: {
    id: number;
    name: string;
    quantity: number;
  };
}

interface IProduct {
  id: number;
  name: string;
  price: number;
  imageUrl: null | string;
  category: {
    id: number;
    name: string;
  };
}

interface IBasketDetails {
  id: number;
  quantity: number;
  product: IProduct;
  orderModifiers: IOrderModifiers[];
}

interface IOrdersResponse {
  id: number;
  createdAt: string;
  organizationName: string;
  orderType: string;
  orderAddress: null | number;
  totalPrice: number;
  basketDetails: IBasketDetails[];
  user: IUser;
}

export type { IOrdersResponse };
