/* eslint-disable no-empty-function */
/* eslint-disable no-use-before-define */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
import { IGlobalResponse } from '@/models/common';
import { ICategoryList, IProductItem, IProductUptade } from '@/models/product';
import { ErrorCallBack, HttpUtil, IHTTPSParams } from '../config';

export interface IGetProductResponse extends IGlobalResponse {
  datas: {
    datas: IProductItem[];
    totalDataCount: number;
  };
}

export interface IGetCategoryListResponse extends IGlobalResponse {
  datas: ICategoryList[];
}

export class ProductService {
  private static instance: ProductService | null;

  private constructor() {}

  public static getInstance(): ProductService {
    if (!this.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance!;
  }

  public async getProduct(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IGetProductResponse> {
    const res = await HttpUtil.get('/Menu/product', params, false, onError);
    return res;
  }

  public async getCategoryList(
    onError?: ErrorCallBack
  ): Promise<IGetCategoryListResponse> {
    const res = await HttpUtil.get(
      '/Menu/category/initial',
      null,
      false,
      onError
    );
    return res;
  }

  public async changeItemStatus(
    id: number,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.put(
      `/Menu/product/activation/${id}`,
      null,
      onError
    );
    return res;
  }

  public async updateProduct(
    body: IProductUptade,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.put('/Menu/product', body, onError);
    return res;
  }

  public async syncProduct(onError?: ErrorCallBack): Promise<IGlobalResponse> {
    const res = await HttpUtil.post('/Menu/Sync', null, onError);
    return res;
  }
}
