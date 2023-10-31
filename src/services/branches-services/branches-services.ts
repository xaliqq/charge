/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
import { IBranchItem, IBranchSelect } from '@/models/branches';
import { IGlobalResponse } from '@/models/common';
import { ErrorCallBack, HttpUtil, IHTTPSParams, } from '../config';

export interface IGetBranchesResponse extends IGlobalResponse {
  datas: {
    datas: IBranchItem[];
    totalDataCount: number;
  };
}
export interface IGetBranchesSelectResponse extends IGlobalResponse {
    datas: IBranchSelect[];
}

export class BranchesServies {
  // eslint-disable-next-line no-use-before-define
  private static instance: BranchesServies | null;

  private constructor() { }

  public static getInstance(): BranchesServies {
    if (!this.instance) {
      BranchesServies.instance = new BranchesServies();
    }
    return BranchesServies.instance!;
  }

  public async changeItemStatus(id: number, onError?: ErrorCallBack): Promise<IGlobalResponse> {
    const res = await HttpUtil.put(`/Organization/activation/${id}`, null, onError);
    return res;
  }


  public async getBranches(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IGetBranchesResponse> {
    const res = await HttpUtil.get('/Organization', params, false, onError);
    return res;
  }

  public async getBranchesSelect(
    onError?: ErrorCallBack
  ): Promise<IGetBranchesSelectResponse> {
    const res = await HttpUtil.get('/client/organization/1', null, false, onError);
    return res;
  }

  public async syncBranches(onError?: ErrorCallBack): Promise<IGlobalResponse> {
    const res = await HttpUtil.post('/Organization', null, onError);
    return res;
  }

  public async syncTerminals(onError?: ErrorCallBack): Promise<IGlobalResponse> {
    const res = await HttpUtil.post('/Terminal', null, onError);
    return res;
  }

  public async updateBranche(body: FormData, onError?: ErrorCallBack): Promise<IGlobalResponse> {
    const res = await HttpUtil.put('/Organization', body, onError);
    return res;
  }
}
