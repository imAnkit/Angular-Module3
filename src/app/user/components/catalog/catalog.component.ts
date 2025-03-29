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
  isLoading = false;
  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.loadInventory();
  }
  loadInventory() {
    this.isLoading = true;
    this.userService.loadInventory().subscribe({
      next: (list) => {
        this.inventories = list;
        console.log(this.inventories);
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
      },
    });
  }
  addToCart(id: string, item: any) {
    this.isLoading = true;
    let cartItem = {
      prodId: id,
      name: item.name,
      amount: 1,
      price: item.price,
    };
    this.userService.addItemToCart(cartItem).subscribe({
      next: () => {
        alert('Item added to cart');
        this.isLoading = false;
      },
      error: (error) => {
        alert(error);
        this.isLoading = false;
      },
    });
  }
}
