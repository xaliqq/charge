/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
import { IGlobalResponse } from '@/models/common';
import { ErrorCallBack, HttpUtil } from '../config';

export interface IReportLineItem {
  day: string;
  totalCount: number;
  value: number;
}

export interface IReportColumnItem {
  deliveryAmount: number;
  deliveryCount: number;
  pickupAmount: number;
  pickupCount: number;
}

export interface IGetReportsLineResponse extends IGlobalResponse {
  datas: IReportLineItem[];
}

export interface IGetReportsColumnResponse extends IGlobalResponse {
  data: IReportColumnItem;
}

export class ReportServies {
  // eslint-disable-next-line no-use-before-define
  private static instance: ReportServies | null;

  private constructor() {}

  public static getInstance(): ReportServies {
    if (!this.instance) {
      ReportServies.instance = new ReportServies();
    }
    return ReportServies.instance!;
  }

  public async getSalesDaily(
    day: number,
    onError?: ErrorCallBack
  ): Promise<IGetReportsLineResponse> {
    const res = await HttpUtil.get(
      `/Statistic/payment/${day}`,
      null,
      false,
      onError
    );
    return res;
  }

  public async getSalesType(
    onError?: ErrorCallBack
  ): Promise<IGetReportsColumnResponse> {
    const res = await HttpUtil.get(
      `/Statistic/payment/order-type`,
      null,
      false,
      onError
    );
    return res;
  }

  //   public async getUsers(
  //     params: IHTTPSParams[],
  //     onError?: ErrorCallBack
  //   ): Promise<IGetUsersResponse> {
  //     const res = await HttpUtil.get('/User/users', params, false, onError);
  //     return res;
  //   }

  //   public async createUser(
  //     payload: IUserItem,
  //     onError?: ErrorCallBack
  //   ): Promise<IGlobalResponse> {
  //     const res = await HttpUtil.post('/User', payload, onError);
  //     return res;
  //   }
}
