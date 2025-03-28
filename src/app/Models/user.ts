export class User {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
    readonly address: string,
    readonly pincode: string,
    readonly phone: string,
    readonly type: string,
    readonly token: string,
    readonly refreshToken: string
  ) {}
}
