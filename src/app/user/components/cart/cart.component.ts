import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { LocalAuthService } from 'src/app/authentication/services/local-auth.service';
import { AdminService } from 'src/app/admin/services/admin.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;
  private userId: string | undefined;
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
    this.userService.loadCartItmes().subscribe((list) => {
      this.cartItems = list;
      console.log(this.cartItems);
      console.log(this.userId);

      this.calculatePrice(this.cartItems);
    });
  }
  calculatePrice(items: any[]) {
    this.totalPrice = 0;
    items.forEach((item) => {
      this.totalPrice += item.price * item.amount;
    });
  }

  increaseItemCount(id: string, item: any) {
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
        this.loadCartItems();
      },

      error: (error) => {
        console.error(error);
      },
    });
  }
  decreaseItemCount(id: string, item: any) {
    let amount = item.amount;
    if (amount > 1) {
      amount--;
    } else {
      this.removeItem(id);
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
        this.loadCartItems();
      },

      error: (error) => {
        console.error(error);
      },
    });
  }
  removeItem(id: string) {
    this.userService.deleteCartItem(id).subscribe({
      next: () => {
        this.loadCartItems();
      },
    });
  }

  bookOrder() {
    if (this.cartItems.length === 0) {
      alert('Cart is empty');
      return;
    }
    this.cartItems.forEach((item) => {
      if (!this.checkIfOrderFeasible(item.prodId, item.amount)) {
        alert('Current Order amount is more than the stock');
        return;
      }
      let newOrder = {
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
        },
        error: (err) => {
          console.error(err);
        },
      });
    });
  }
  checkIfOrderFeasible(id: string, amount: number): Observable<boolean> {
    let check = new Subject<boolean>();
    let answer = false;
    let currProd = {
      id: '',
      name: '',
      quantity: 0,
      price: 0,
    };
    this.adminService.getProductById(id).subscribe((item) => {
      currProd = { ...item, id: id };
      answer = currProd.quantity >= amount ? true : false;
      check.next(answer);
    });
    return check.asObservable();
  }
  adjustProductCount(id: string, amount: number) {
    let currProd = {
      id: '',
      name: '',
      quantity: 0,
      price: 0,
    };
    this.adminService.getProductById(id).subscribe((item) => {
      currProd = { ...item, id: id };
      let newProd = {
        id: currProd.id,
        name: currProd.name,
        quantity: currProd.quantity - amount,
        price: currProd.price,
      };
      this.adminService.updateProduct(currProd.id, newProd).subscribe();
    });
  }
}
