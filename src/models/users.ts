import { selectOption } from "./common"

interface IUserItem {
    id: string,
    firstname: string,
    lastname: string,
    email: string,
    phoneNumber: string,
    genderId: selectOption | string | number | null,
    apiLogin: string,
    birthday: string | Date | null,
    roleId: selectOption | string | number | null,
}

export type { IUserItem }