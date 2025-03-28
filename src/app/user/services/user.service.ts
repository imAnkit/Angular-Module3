import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LocalAuthService } from 'src/app/authentication/services/local-auth.service';
import { BASE_URL } from 'src/app/shared/constants/firebaseEnvironment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private inventoryUrl = `${BASE_URL}/inventory`;
  private ordersUrl = `${BASE_URL}/orders`;
  private cartUrl = `${BASE_URL}/cart`;
  private userUrl = `${BASE_URL}/USERS`;
  private userId: string | undefined;
  constructor(
    private http: HttpClient,
    private localAuthService: LocalAuthService
  ) {
    this.userId = this.localAuthService.getUserId();
  }

  loadInventory(): Observable<any[]> {
    return this.http.get(`${this.inventoryUrl}.json`).pipe(
      map((response: any) => {
        if (!response) return [];

        return Object.keys(response).map((key) => ({
          id: key,
          ...response[key],
        }));
      })
    );
  }
  loadCartItmes(): Observable<any[]> {
    return this.http.get(`${this.cartUrl}/${this.userId}.json`).pipe(
      map((response: any) => {
        if (!response) return [];

        return Object.keys(response).map((key) => ({
          ...response[key],
          id: key,
        }));
      })
    );
  }

  updateCartItem(id: string, item: any) {
    return this.http.put(`${this.cartUrl}/${this.userId}/${id}.json`, item);
  }
  addItemToCart(item: any): Observable<any> {
    return this.http.post(`${this.cartUrl}/${this.userId}.json`, item);
  }

  deleteCartItem(id: string) {
    return this.http.delete(`${this.cartUrl}/${this.userId}/${id}.json`);
  }

  loadOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.ordersUrl}.json`).pipe(
      map((response: any) => {
        if (!response) return [];

        return Object.keys(response).map((key) => ({
          ...response[key],
          id: key,
        }));
      })
    );
  }
  getUserDetails(): Observable<any> {
    return this.http.get<any>(`${this.userUrl}/${this.userId}.json`);
  }
  updateUser(id: string, user: any) {
    return this.http.put(`${this.userUrl}/${id}.json`, user);
  }
}
