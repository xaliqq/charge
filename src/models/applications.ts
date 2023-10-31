interface IApplicationItemShared {
    firstname: string,
    lastname: string,
    fathersName: string,
}

interface IApplicationItem extends IApplicationItemShared {
    id: number,
    email: string,
    phoneNumber: string,
    message: string,
    cvLocation: string
}

interface IApplicationFilter extends IApplicationItemShared { }

export type { IApplicationItem, IApplicationFilter }