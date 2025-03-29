import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { LocalAuthService } from 'src/app/authentication/services/local-auth.service';
import { AdminService } from 'src/app/admin/services/admin.service';
import { map, Observable, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;
  private userId: string | undefined;
  isLoading = false;
  constructor(
    private userService: UserService,
    private localAuthService: LocalAuthService,
    private adminService: AdminService
  ) {}
  ngOnInit(): void {
    this.loadCartItems();
    this.userId = this.localAuthService.getUserId();
  }
  loadCartItems() {
    this.isLoading = true;
    this.userService.loadCartItmes().subscribe((list) => {
      this.cartItems = list;

      this.calculatePrice(this.cartItems);
      this.isLoading = false;
    });
  }
  calculatePrice(items: any[]) {
    this.totalPrice = 0;
    items.forEach((item) => {
      this.totalPrice += item.price * item.amount;
    });
  }

  increaseItemCount(id: string, item: any) {
    this.isLoading = true;
    let amount = item.amount;
    amount++;
    let newItem = {
      id: item.id,
      prodId: item.prodId,
      name: item.name,
      amount: amount,
      price: item.price,
    };
    this.userService.updateCartItem(id, newItem).subscribe({
      next: () => {
        console.log('Cart item updated');
        this.isLoading = false;
        this.loadCartItems();
      },

      error: (error) => {
        console.error(error);
        this.isLoading = false;
      },
    });
  }
  decreaseItemCount(id: string, item: any) {
    this.isLoading = true;
    let amount = item.amount;
    if (amount > 1) {
      amount--;
    } else {
      this.removeItem(id);
      return;
    }
    let newItem = {
      id: item.id,
      prodId: item.prodId,
      name: item.name,
      amount: amount,
      price: item.price,
    };
    this.userService.updateCartItem(id, newItem).subscribe({
      next: () => {
        console.log('Cart item updated');
        this.isLoading = false;
        this.loadCartItems();
      },

      error: (error) => {
        console.error(error);
        this.isLoading = false;
      },
    });
  }
  removeItem(id: string) {
    this.isLoading = true;
    this.userService.deleteCartItem(id).subscribe({
      next: () => {
        this.isLoading = false;
        this.loadCartItems();
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
      },
    });
  }
  bookOrder() {
    if (this.cartItems.length === 0) {
      alert('Cart is empty');
      return;
    }
    this.isLoading = true;
    const orderIsFeasible = this.cartItems.map((item) =>
      this.checkIfOrderFeasible(item.prodId, item.amount)
    );

    Promise.all(orderIsFeasible.map((obs) => obs.toPromise())).then(
      (results) => {
        if (results.includes(false)) {
          alert('Some Items in the cart are more than we have in stock.');
          this.isLoading = false;
          return;
        }

        this.cartItems.forEach((item) => {
          const newOrder = {
            prodId: item.prodId,
            prodName: item.name,
            date: new Date().toISOString(),
            price: item.price * item.amount,
            amount: item.amount,
            status: 'Placed',
            userId: this.userId,
          };
          this.adjustProductCount(item.prodId, item.amount);
          this.userService.placeOrder(newOrder).subscribe({
            next: () => {
              this.removeItem(item.id);
              console.log(`Order placed for ${item.name}`);
              this.isLoading = false;
            },
            error: (err) => {
              console.error('Error While placing order', err);
              this.isLoading = false;
            },
          });
        });
      }
    );
  }

  checkIfOrderFeasible(id: string, amount: number): Observable<boolean> {
    return this.adminService
      .getProductById(id)
      .pipe(map((item) => item.quantity >= amount));
  }

  adjustProductCount(id: string, amount: number) {
    this.adminService
      .getProductById(id)
      .pipe(
        map((item) => ({
          id,
          name: item.name,
          quantity: item.quantity - amount,
          price: item.price,
        })),
        switchMap((updatedProduct) =>
          this.adminService.updateProduct(id, updatedProduct)
        )
      )
      .subscribe({
        next: () => {
          console.log('Product count adjusted');
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
}
