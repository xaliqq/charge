/* eslint-disable no-empty-function */
/* eslint-disable no-use-before-define */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
import { IGlobalResponse, selectOption } from '@/models/common';
import { IPartnersItem } from '@/models/partner';
import { ErrorCallBack, HttpUtil, IHTTPSParams } from '../config';

export interface IGetPartnersResponse extends IGlobalResponse {
  data: {
    data: IPartnersItem[];
    totalDataCount: number;
  };
}
export interface IGetPartnersSelectResponse extends IGlobalResponse {
  data: selectOption[];
}

export class PartnerServices {
  private static instance: PartnerServices | null;

  private constructor() {}

  public static getInstance(): PartnerServices {
    if (!this.instance) {
      PartnerServices.instance = new PartnerServices();
    }
    return PartnerServices.instance!;
  }

  public async getPartners(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IGetPartnersResponse> {
    const res = await HttpUtil.get('/partner', params, false, onError);
    return res;
  }

  public async createPartner(
    payload: IPartnersItem,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.post('/partner', payload, onError);
    return res;
  }

  public async updatePartner(
    payload: IPartnersItem,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.put('/partner/percentage', payload, onError);
    return res;
  }

  public async getPartnersSelect(
    params?: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IGetPartnersSelectResponse> {
    const res = await HttpUtil.get(
      '/partner/initial',
      params || null,
      false,
      onError
    );
    return res;
  }
}
