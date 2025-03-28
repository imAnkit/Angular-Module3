import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from 'src/app/Models/user';

@Injectable({
  providedIn: 'root',
})
export class LocalAuthService {
  private USER_KEY = `USER_DATA`;
  private user: User | undefined = undefined;
  private userSubject = new Subject<User | undefined>();
  constructor() {
    this.user = this.getUserFromLocalStorage();
    this.userSubject.next(this.user);
  }

  getUser() {
    return this.user ? this.user : undefined;
  }

  getUserId() {
    return this.user ? this.user.id : undefined;
  }

  getUserSubject(): Observable<User | undefined> {
    return this.userSubject.asObservable();
  }

  setUserInLocalStorage(user: User) {
    this.user = user;
    this.userSubject.next(user);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUserFromLocalStorage() {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : undefined;
  }

  logout() {
    this.user = undefined;
    this.userSubject.next(undefined);
    localStorage.removeItem(this.USER_KEY);
  }
}
