/* eslint-disable no-empty-function */
/* eslint-disable no-use-before-define */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
import { IGlobalResponse } from '@/models/common';
import { IOrdersResponse } from '@/models/orders';
import { ErrorCallBack, HttpUtil, IHTTPSParams } from '../config';

export interface IGetOrdersResponse extends IGlobalResponse {
  datas: {
    datas: IOrdersResponse[];
    totalDataCount: number;
  };
}

export class OrderServices {
  private static instance: OrderServices | null;

  private constructor() {}

  public static getInstance(): OrderServices {
    if (!this.instance) {
      OrderServices.instance = new OrderServices();
    }
    return OrderServices.instance!;
  }

  public async getOrders(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IGetOrdersResponse> {
    const res = await HttpUtil.get('/orders', params, false, onError);
    return res;
  }
}
