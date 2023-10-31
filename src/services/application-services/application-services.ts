/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
import { IApplicationItem } from '@/models/applications';
import { IGlobalResponse } from '@/models/common';
import { ErrorCallBack, HttpUtil, IHTTPSParams } from '../config';

export interface IGetApplicationsResponse extends IGlobalResponse {
  datas: {
    datas: IApplicationItem[];
    totalDataCount: number;
  };
}

export class ApplicationsServies {
  // eslint-disable-next-line no-use-before-define
  private static instance: ApplicationsServies | null;

  private constructor() {}

  public static getInstance(): ApplicationsServies {
    if (!this.instance) {
      ApplicationsServies.instance = new ApplicationsServies();
    }
    return ApplicationsServies.instance!;
  }

  public async getApplications(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IGetApplicationsResponse> {
    const res = await HttpUtil.get('/Application', params, false, onError);
    return res;
  }

  public async getApplciationDocuments(
    id: number,
    onError?: ErrorCallBack
  ): Promise<any> {
    const res = await HttpUtil.get(
      `/Application/cv/${id}`,
      null,
      true,
      onError
    );
    return res;
  }
}
