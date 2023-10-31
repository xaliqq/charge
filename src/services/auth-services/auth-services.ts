/* eslint-disable class-methods-use-this */

import { IAuth, IAuthLogin } from '@/models/user';
import { ErrorCallBack, HttpUtil } from '../config';

export interface IAuthResponse {
  message: string;
  succeeded: boolean;
  user: IAuthLogin;
}
export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export class AuthService {
  public async getUserData(onError?: ErrorCallBack): Promise<IAuthResponse> {
    const res = await HttpUtil.get('/Auth/PersonalDatas', null, false, onError);
    return res;
  }

  public async getToken(
    body: IAuthLogin,
    onError?: ErrorCallBack
  ): Promise<IAuth | null> {
    const res = await HttpUtil.post('/auth/login', body, onError);
    return res;
  }

  public async changePassword(
    body: IChangePassword,
    onError?: ErrorCallBack
  ): Promise<IAuth> {
    const res = await HttpUtil.put('/Auth/ChangePassword', body, onError);
    return res;
  }
}
