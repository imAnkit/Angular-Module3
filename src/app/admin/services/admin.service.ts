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
  private user: User | undefined = undefined;
  constructor(
    private http: HttpClient,
    private localAuthService: LocalAuthService
  ) {
    this.user = this.localAuthService.getUser();
  }

  loadInventory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.inventoryUrl}.json`).pipe(
      map((response) => {
        if (!response) return [];

        return Object.keys(response).map((key) => ({
          id: key,
          ...response,
        }));
      })
    );
  }

  addProduct(product: { name: string; quantity: number }) {
    return this.http.post(`${this.inventoryUrl}.json`, product);
  }

  deleteProduct(id: string) {
    return this.http.delete(`${this.inventoryUrl}/${id}.json`);
  }

  loadOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.ordersUrl}.json`).pipe(
      map((response) => {
        if (!response) return [];

        return Object.keys(response).map((key) => ({
          ...response,
          id: key,
        }));
      })
    );
  }

  updateOrder(id: string, order: any) {
    return this.http.put(`${this.ordersUrl}/${id}.json`, order);
  }

  getUserDetails() {}
}
