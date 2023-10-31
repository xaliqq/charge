/* eslint-disable no-empty-function */
/* eslint-disable no-use-before-define */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
import { IGlobalResponse } from '@/models/common';
import { ICategoryItem, ICategoryUptade } from '@/models/category';
import { ErrorCallBack, HttpUtil, IHTTPSParams } from '../config';

export interface IGetCategoryResponse extends IGlobalResponse {
  datas: {
    datas: ICategoryItem[];
    totalDataCount: number;
  };
}

export class CategoryService {
  private static instance: CategoryService | null;

  private constructor() {}

  public static getInstance(): CategoryService {
    if (!this.instance) {
      CategoryService.instance = new CategoryService();
    }
    return CategoryService.instance!;
  }

  public async getCategory(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IGetCategoryResponse> {
    const res = await HttpUtil.get('/Menu/category', params, false, onError);
    return res;
  }

  public async changeItemStatus(
    id: number,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.put(
      `/Menu/category/activation/${id}`,
      null,
      onError
    );
    return res;
  }

  public async updateCategory(
    body: ICategoryUptade,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.put('/Menu/category', body, onError);
    return res;
  }

  public async syncCategories(
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.post('/Menu/Sync', null, onError);
    return res;
  }
}
