/* eslint-disable class-methods-use-this */
import { IGlobalResponse } from '@/models/common';
import { IPostSliderResponse, ISliderListItem } from '@/models/web-slider';
import { ErrorCallBack, HttpUtil, IHTTPSParams } from '../config';

export interface IGetSliderResponse extends IGlobalResponse {
  sliders: {
    datas: ISliderListItem[];
    totalDataCount: number;
  };
}

export class SliderService {
  public async getItems(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IGetSliderResponse> {
    const res = await HttpUtil.get('/Slider', params, false, onError);
    return res;
  }

  public async postItem(
    body: FormData,
    onError?: ErrorCallBack
  ): Promise<IPostSliderResponse> {
    const res = await HttpUtil.post('/Slider', body, onError);
    return res;
  }

  public async updateItem(
    body: FormData,
    onError?: ErrorCallBack
  ): Promise<IPostSliderResponse> {
    const res = await HttpUtil.put('/Slider', body, onError);
    return res;
  }

  public async deleteItem(
    id: number,
    onError?: ErrorCallBack
  ): Promise<IPostSliderResponse> {
    const res = await HttpUtil.delete(`/Slider/${id}`, null, onError);
    return res;
  }

  public async changeItemStatus(
    id: number,
    onError?: ErrorCallBack
  ): Promise<IPostSliderResponse> {
    const res = await HttpUtil.put(`/Slider/activation/${id}`, null, onError);
    return res;
  }

  public async getItemById(
    id: number,
    onError?: ErrorCallBack
  ): Promise<IGetSliderResponse> {
    const res = await HttpUtil.get(`/Slider/${id}`, null, false, onError);
    return res;
  }
}
