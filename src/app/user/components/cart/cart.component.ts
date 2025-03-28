import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  currentItem = {};
  totalPrice = 0;
  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.loadCartItems();
  }
  loadCartItems() {
    this.userService.loadCartItmes().subscribe({
      next: (list) => {
        this.cartItems = list;
        console.log(this.cartItems);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  bookOrder() {}

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
}
