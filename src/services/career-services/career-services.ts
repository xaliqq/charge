/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
import { ICareerHeaderPayload, ICareerListItem, IGetCareerBannerItem } from '@/models/career';
import { IGlobalResponse } from '@/models/common';
import { ErrorCallBack, HttpUtil, IHTTPSParams, } from '../config';


export interface IGetCareerBannerResponse extends IGlobalResponse {
    data: IGetCareerBannerItem;
}
export interface IGetCareerHeaderResponse extends IGlobalResponse {
    data: ICareerHeaderPayload;
}
export interface IGetCareerListResponse extends IGlobalResponse {
    datas: {
        datas: ICareerListItem[],
        totalDataCount: number;
    }
}

export class CareerServices {
    // eslint-disable-next-line no-use-before-define
    private static instance: CareerServices | null;

    private constructor() { }

    public static getInstance(): CareerServices {
        if (!this.instance) {
            CareerServices.instance = new CareerServices();
        }
        return CareerServices.instance!;
    }


    public async getCareerBanner(onError?: ErrorCallBack
    ): Promise<IGetCareerBannerResponse> {
        const res = await HttpUtil.get(`/Career/banner`, null, false, onError);
        return res;
    }

    public async updateCareerBanner(body: FormData, onError?: ErrorCallBack
    ): Promise<IGetCareerBannerResponse> {
        const res = await HttpUtil.put(`/Career/banner`, body, onError);
        return res;
    }

    public async updateCareerHeader(body: ICareerHeaderPayload, onError?: ErrorCallBack
    ): Promise<IGlobalResponse> {
        const res = await HttpUtil.put(`/Career/header`, body, onError);
        return res;
    }

    public async getCareerHeader(id: number, onError?: ErrorCallBack
    ): Promise<IGetCareerHeaderResponse> {
        const res = await HttpUtil.get(`/Career/header/${id}`, null, false, onError);
        return res;
    }

    public async getCareerList(params: IHTTPSParams[], onError?: ErrorCallBack): Promise<IGetCareerListResponse> {
        const res = await HttpUtil.get(`/Career/content`, params, false, onError);
        return res;
    }

    public async createCareerList(body: FormData, onError?: ErrorCallBack): Promise<IGlobalResponse> {
        const res = await HttpUtil.post(`/Career/content`, body, onError)
        return res
    }

    public async updateCareerList(body: FormData, onError?: ErrorCallBack): Promise<IGlobalResponse> {
        const res = await HttpUtil.put(`/Career/content`, body, onError)
        return res
    }

    public async changeItemStatus(id: number, onError?: ErrorCallBack): Promise<IGlobalResponse> {
        const res = await HttpUtil.put(`/Career/content/activation/${id}`, null, onError);
        return res;
    }


}
