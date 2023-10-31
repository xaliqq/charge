/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
import { IGlobalResponse } from '@/models/common';
import { IMessageItem, IMessageItemDetailed } from '@/models/messages';
import { ErrorCallBack, HttpUtil, IHTTPSParams, } from '../config';

export interface IGetMessagesResponse extends IGlobalResponse {
    datas: {
        datas: IMessageItem[];
        totalDataCount: number;
    };
}
export interface IGetMessageDetailedResponse extends IGlobalResponse {
    data: IMessageItemDetailed;
}

export class MessagesServices {
    // eslint-disable-next-line no-use-before-define
    private static instance: MessagesServices | null;

    private constructor() { }

    public static getInstance(): MessagesServices {
        if (!this.instance) {
            MessagesServices.instance = new MessagesServices();
        }
        return MessagesServices.instance!;
    }

    public async getMessages(
        params: IHTTPSParams[], onError?: ErrorCallBack
    ): Promise<IGetMessagesResponse> {
        const res = await HttpUtil.get('/Contact/messages', params, false, onError);
        return res;
    }

    public async getMessageById(
        id: string, onError?: ErrorCallBack
    ): Promise<IGetMessageDetailedResponse> {
        const res = await HttpUtil.get(`/Contact/messages/details/${id}`, null, false, onError);
        return res;
    }



}
