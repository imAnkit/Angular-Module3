import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent implements OnInit {
  inventories: any[] = [];
  currentProductId!: string;
  cartItem = {
    name: '',
    amount: 1,
    price: 0,
  };
  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.loadInventory();
  }
  loadInventory() {
    this.userService.loadInventory().subscribe({
      next: (list) => {
        this.inventories = list;
        console.log(this.inventories);
      },
      error: (error) => {},
    });
  }
  addToCart(id: string, item: any) {
    this.cartItem = {
      name: item.name,
      amount: 1,
      price: item.price,
    };
    this.userService.addItemToCart(this.cartItem).subscribe({
      next: () => {
        alert('Item added to cart');
      },
      error: (error) => {
        alert(error);
      },
    });

    this.cartItem = {
      name: '',
      amount: 1,
      price: 0,
    };
  }
}
