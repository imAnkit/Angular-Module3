import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { LocalAuthService } from 'src/app/authentication/services/local-auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  currentItem = {};
  totalPrice: number = 0;
  private userId: string | undefined;
  constructor(
    private userService: UserService,
    private localAuthService: LocalAuthService
  ) {}
  ngOnInit(): void {
    this.loadCartItems();
    this.userId = this.localAuthService.getUserId();
  }
  calculatePrice(items: any[]) {
    this.totalPrice = 0;
    items.forEach((item) => {
      this.totalPrice += item.price * item.amount;
    });
  }
  loadCartItems() {
    this.userService.loadCartItmes().subscribe({
      next: (list) => {
        this.cartItems = list;

        this.calculatePrice(this.cartItems);
        console.log(this.cartItems);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  increaseItemCount(id: string, item: any) {
    let amount = item.amount;
    amount++;
    let newItem = {
      id: item.id,
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
      let newOrder = {
        prodId: item.id,
        prodName: item.name,
        data: new Date().toISOString(),
        price: item.price * item.amount,
        amount: item.amount,
        status: 'Placed',
        userId: this.userId,
      };
      this.userService.placeOrder(newOrder).subscribe({
        next: () => {
          this.removeItem(item.id);
          console.log(`Order placed for ${item.name}`);
        },
      });
    });
  }
}
