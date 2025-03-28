export class AuthResponse {
  constructor(
    readonly idToken: string,
    readonly email: string,
    readonly refreshToken: string,
    readonly expiresIn: string,
    readonly localId: string
  ) {}
}
