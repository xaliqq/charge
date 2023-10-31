/* eslint-disable no-empty-function */
/* eslint-disable no-use-before-define */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
import { IGlobalResponse } from '@/models/common';
import { IConnectorTypesItem } from '@/models/connector-types';
import { ErrorCallBack, HttpUtil, IHTTPSParams } from '../config';

export interface IGetConnectorTypesResponse extends IGlobalResponse {
  data: {
    data: IConnectorTypesItem[];
    totalDataCount: number;
  };
}

export class ConnectorTypeServices {
  private static instance: ConnectorTypeServices | null;

  private constructor() {}

  public static getInstance(): ConnectorTypeServices {
    if (!this.instance) {
      ConnectorTypeServices.instance = new ConnectorTypeServices();
    }
    return ConnectorTypeServices.instance!;
  }

  public async getConnectorTypes(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IGetConnectorTypesResponse> {
    const res = await HttpUtil.get('/plugtype/plug', params, false, onError);
    return res;
  }

  public async createConnectorType(
    payload: IConnectorTypesItem,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.post('/plugtype/plug', payload, onError);
    return res;
  }

  public async updateConnectorType(
    body: IConnectorTypesItem,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.put('/plugtype/plug', body, onError);
    return res;
  }

  public async deleteConnectorType(
    id: number | undefined,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.delete(`/plugtype/plug/${id}`, null, onError);
    return res;
  }
}
