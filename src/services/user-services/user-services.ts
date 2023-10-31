/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
import { IUserItem } from '@/models/users';
import { IGlobalResponse } from '@/models/common';
import { IAdminsItem } from '@/models/admins';
import { ErrorCallBack, HttpUtil, IHTTPSParams } from '../config';

export interface IGetUsersResponse extends IGlobalResponse {
  datas: {
    datas: IUserItem[];
    totalDataCount: number;
  };
}

export class UsersServies {
  // eslint-disable-next-line no-use-before-define
  private static instance: UsersServies | null;

  private constructor() {}

  public static getInstance(): UsersServies {
    if (!this.instance) {
      UsersServies.instance = new UsersServies();
    }
    return UsersServies.instance!;
  }

  public async blockClient(
    id: string,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.put(`/User/activation/${id}`, null, onError);
    return res;
  }

  public async getUsers(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IGetUsersResponse> {
    const res = await HttpUtil.get('/User/users', params, false, onError);
    return res;
  }

  public async createUser(
    payload: IAdminsItem,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.post('/User', payload, onError);
    return res;
  }
}
