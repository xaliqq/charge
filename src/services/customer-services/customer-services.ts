/* eslint-disable no-empty-function */
/* eslint-disable no-use-before-define */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
import { IGlobalResponse } from '@/models/common';
import { ICustomersItem } from '@/models/customers';
import { ErrorCallBack, HttpUtil, IHTTPSParams } from '../config';

export interface IGetCustomersResponse extends IGlobalResponse {
  data: {
    data: ICustomersItem[];
    totalDataCount: number;
  };
}

export class CustomerServices {
  private static instance: CustomerServices | null;

  private constructor() {}

  public static getInstance(): CustomerServices {
    if (!this.instance) {
      CustomerServices.instance = new CustomerServices();
    }
    return CustomerServices.instance!;
  }

  public async getCustomers(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IGetCustomersResponse> {
    const res = await HttpUtil.get('/auth/clients', params, false, onError);
    return res;
  }
}
