import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalAuthService } from './local-auth.service';
import {
  BASE_URL,
  SIGN_IN_URL,
  SIGN_UP_URL,
} from 'src/app/shared/constants/firebaseEnvironment';
import { map, switchMap, tap } from 'rxjs';
import { AuthResponse } from 'src/app/Models/auth/authResponse';
import { User } from 'src/app/Models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userEndpoint = `users`;
  constructor(
    private http: HttpClient,
    private localAuthService: LocalAuthService
  ) {}

  signup(user: { email: string; password: string; type: string }) {
    return this.http
      .post<AuthResponse>(SIGN_UP_URL, {
        ...user,
        returnSecureToken: true,
      })
      .pipe(switchMap((response) => this.saveData(response, user.type)));
  }

  saveData(response: AuthResponse, type: string) {
    const localId = response.localId;
    const idToken = response.idToken;
    return this.http.put<User>(
      `${BASE_URL}/${this.userEndpoint}/${localId}.json?auth=${idToken}`,
      {
        id: localId,
        name: '',
        email: response.email,
        type: type,
        address: '',
        pincode: '',
        phone: '',
      }
    );
  }

  signin(user: { email: string; password: string }) {
    return this.http
      .post<AuthResponse>(SIGN_IN_URL, {
        ...user,
        returnSecureToken: true,
      })
      .pipe(switchMap((response) => this.fetchData(response)));
  }

  fetchData(response: AuthResponse) {
    const localId = response.localId;
    const idToken = response.idToken;
    return this.http
      .get<User>(
        `${BASE_URL}/${this.userEndpoint}/${localId}.json?auth=${idToken}`
      )
      .pipe(
        map((user) => ({
          ...user,
          idToken: response.idToken,
          refreshToken: response.refreshToken,
        })),
        tap((user) => this.localAuthService.setUserInLocalStorage(user))
      );
  }

  logout() {
    this.localAuthService.logout();
  }
}
