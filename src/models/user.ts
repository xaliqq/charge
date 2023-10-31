export interface IAuthLogin {
  email: string;
  password: string;
}
export interface IAuth {
  data: {
    email: string;
    firstname: string;
    id: string;
    isBlocked: boolean;
    lastname: string;
    phoneNumber: string;
    role: string;
    token: string;
    username: string;
  };
}
