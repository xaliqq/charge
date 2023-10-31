/* eslint-disable no-empty-function */
/* eslint-disable no-use-before-define */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
import {
  IChargePointDetailItem,
  IChargePointsItem
} from '@/models/charge-points';
import { IGlobalResponse } from '@/models/common';
import { ErrorCallBack, HttpUtil, IHTTPSParams } from '../config';

export interface IGetChargePointsResponse extends IGlobalResponse {
  data: {
    data: IChargePointsItem[];
    totalDataCount: number;
  };
}

export class ChargePointServices {
  private static instance: ChargePointServices | null;

  private constructor() {}

  public static getInstance(): ChargePointServices {
    if (!this.instance) {
      ChargePointServices.instance = new ChargePointServices();
    }
    return ChargePointServices.instance!;
  }

  public async getChargePoints(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IGetChargePointsResponse> {
    const res = await HttpUtil.get(
      '/charge/admin/charge-points',
      params,
      false,
      onError
    );
    return res;
  }

  public async getChargePointById(
    id: string,
    onError?: ErrorCallBack
  ): Promise<IChargePointDetailItem> {
    const res = await HttpUtil.get(
      `/charge/charge-points/${id}`,
      null,
      false,
      onError
    );
    return res;
  }

  public async activateChargePoint(
    payload: any,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.put('/charge/activate', payload, onError);
    return res;
  }

  public async addPartner(
    payload: any,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.post('/charge/add-partner', payload, onError);
    return res;
  }
}
