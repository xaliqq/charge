/* eslint-disable class-methods-use-this */
import { IGlobalResponse } from '@/models/common';
import { IWebElevenItem } from '@/models/web-eleven';
import { ErrorCallBack, HttpUtil, IHTTPSParams, } from '../config';

export interface IGetElevenResponse extends IGlobalResponse {
  datas: {
    datas: IWebElevenItem[];
    totalDataCount: number;
  };
}

export class ElevenService {
  public async getItems(params: IHTTPSParams[], onError?: ErrorCallBack): Promise<IGetElevenResponse> {
    const res = await HttpUtil.get('/Ingridient', params, false, onError);
    return res;
  }

  public async postItem(body: FormData, onError?: ErrorCallBack): Promise<IGlobalResponse> {
    const res = await HttpUtil.post('/Ingridient', body, onError);
    return res;
  }

  public async deleteItem(number: number, onError?: ErrorCallBack): Promise<IGlobalResponse> {
    const res = await HttpUtil.delete(`Ingridient/${number}`, null, onError);
    return res;
  }

  public async changeItemStatus(id: number, onError?: ErrorCallBack): Promise<IGlobalResponse> {
    const res = await HttpUtil.put(`/Ingridient/activation/${id}`, null, onError);
    return res;
  }

  public async updateItem(body: FormData, onError?: ErrorCallBack): Promise<IGlobalResponse> {
    const res = await HttpUtil.put('/Ingridient', body, onError);
    return res;
  }
}
