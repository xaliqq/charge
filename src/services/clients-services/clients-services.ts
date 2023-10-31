/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
import { IClientsItem } from '@/models/clients';
import { IGlobalResponse } from '@/models/common';
import { ErrorCallBack, HttpUtil, IHTTPSParams, } from '../config';

export interface IGetClientsResponse extends IGlobalResponse {
    datas: {
        datas: IClientsItem[];
        totalDataCount: number;
    };
}

export class ClientsServies {
    // eslint-disable-next-line no-use-before-define
    private static instance: ClientsServies | null;

    private constructor() { }

    public static getInstance(): ClientsServies {
        if (!this.instance) {
            ClientsServies.instance = new ClientsServies();
        }
        return ClientsServies.instance!;
    }

    public async blockClient(id: string, onError?: ErrorCallBack): Promise<IGlobalResponse> {
        const res = await HttpUtil.put(`/User/activation/${id}`, null, onError);
        return res;
    }


    public async getClients(
        params: IHTTPSParams[], onError?: ErrorCallBack
    ): Promise<IGetClientsResponse> {
        const res = await HttpUtil.get('/User/clients', params, false, onError);
        return res;
    }

}
