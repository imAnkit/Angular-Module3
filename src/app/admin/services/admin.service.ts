import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LocalAuthService } from 'src/app/authentication/services/local-auth.service';
import { User } from 'src/app/Models/user';
import { BASE_URL } from 'src/app/shared/constants/firebaseEnvironment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private inventoryUrl = `${BASE_URL}/inventory`;
  private ordersUrl = `${BASE_URL}/orders`;
  private userUrl = `${BASE_URL}/users`;
  // private user: User | undefined = undefined;
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

  addProduct(product: any): Observable<any> {
    return this.http.post(`${this.inventoryUrl}.json`, product);
  }
  updateProduct(id: string, product: any) {
    return this.http.put(`${this.inventoryUrl}/${id}.json`, product);
  }

  deleteProduct(id: string) {
    return this.http.delete(`${this.inventoryUrl}/${id}.json`);
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

  updateOrder(id: string, order: any) {
    return this.http.put(`${this.ordersUrl}/${id}.json`, order);
  }

  getUserDetails(): Observable<any> {
    return this.http.get<any>(`${this.userUrl}/${this.userId}.json`);
  }
  updateUser(id: string, user: any) {
    return this.http.put(`${this.userUrl}/${id}.json`, user);
  }
}
