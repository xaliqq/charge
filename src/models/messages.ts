interface IMessageItemShared {
    senderFirstname: string,
    senderLastname: string,
    senderPhone: string,
}

interface IMessageItem extends IMessageItemShared {
    id: number,
    createdAt: string,
    isSendedByBlockedUser: boolean,
    organizationName: null | string
}

interface IMessageItemDetailed extends IMessageItem {
    description: string,
    sendersGender: string,
}

interface IMessageFilter extends IMessageItemShared { }
export type { IMessageItem, IMessageItemDetailed, IMessageFilter }