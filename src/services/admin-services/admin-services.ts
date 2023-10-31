/* eslint-disable no-empty-function */
/* eslint-disable no-use-before-define */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
import { IGlobalResponse } from '@/models/common';
import { IAdminsItem } from '@/models/admins';
import { ErrorCallBack, HttpUtil, IHTTPSParams } from '../config';

export interface IGetAdminsResponse extends IGlobalResponse {
  data: {
    data: IAdminsItem[];
    totalDataCount: number;
  };
}

export class AdminServices {
  private static instance: AdminServices | null;

  private constructor() {}

  public static getInstance(): AdminServices {
    if (!this.instance) {
      AdminServices.instance = new AdminServices();
    }
    return AdminServices.instance!;
  }

  public async getAdmins(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IGetAdminsResponse> {
    const res = await HttpUtil.get('/auth/admins', params, false, onError);
    return res;
  }

  public async createAdmin(
    payload: IAdminsItem,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.post('/auth/createuser', payload, onError);
    return res;
  }
}
