/* eslint-disable class-methods-use-this */
import { IGlobalResponse } from '@/models/common';
import { IWebAboutItem } from '@/models/web-about';
import { ErrorCallBack, HttpUtil, IHTTPSParams, } from '../config';

export interface IGetAboutResponse extends IGlobalResponse {
  datas: {
    datas: IWebAboutItem[];
    totalDataCount: number;
  };
}
export interface IWebAboutHeaderUpdatePayload {
  title: string;
  description: string;
  languageId: number | null;
}
export interface IWebAboutHeaderGetResponse extends IGlobalResponse {
  data: {
    id: number;
    title: string;
    description: string;
    languageId: number;
  };
}
export class AboutService {
  public async getItems(params: IHTTPSParams[], onError?: ErrorCallBack): Promise<IGetAboutResponse> {
    const res = await HttpUtil.get('/About/content', params, false, onError);
    return res;
  }

  public async postItem(body: FormData, onError?: ErrorCallBack): Promise<IGlobalResponse> {
    const res = await HttpUtil.post('/About/content', body, onError);
    return res;
  }

  public async deleteItem(number: number, onError?: ErrorCallBack): Promise<IGlobalResponse> {
    const res = await HttpUtil.delete(`About/content/${number}`, null, onError);
    return res;
  }

  public async changeItemStatus(id: number, onError?: ErrorCallBack): Promise<IGlobalResponse> {
    const res = await HttpUtil.put(`/About/content/activation/${id}`, null, onError);
    return res;
  }

  public async updateItem(body: FormData, onError?: ErrorCallBack): Promise<IGlobalResponse> {
    const res = await HttpUtil.put('/About/content', body, onError);
    return res;
  }

  public async updateItemHeader(
    body: IWebAboutHeaderUpdatePayload, onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.put('/About/header', body, onError);
    return res;
  }

  public async getItemsHeader(
    langID: number, onError?: ErrorCallBack
  ): Promise<IWebAboutHeaderGetResponse> {
    const res = await HttpUtil.get(`/About/header/${langID}`, null, false, onError);
    return res;
  }
}
