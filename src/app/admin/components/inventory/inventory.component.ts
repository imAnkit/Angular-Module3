import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent implements OnInit {
  inventories: any[] = [];
  currentProductId!: string;

  newProduct = {
    name: '',
    quantity: 0,
    price: 0,
  };
  isLoading = false;
  constructor(private adminService: AdminService) {}
  ngOnInit(): void {
    this.loadInventory();
  }
  loadInventory() {
    this.isLoading = true;
    this.adminService.loadInventory().subscribe({
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
  decreaseProductCount(id: string, product: any) {
    let productQuanity = product.quantity;
    if (productQuanity > 1) {
      productQuanity--;
    } else {
      this.deleteProduct(id);
    }
    product = {
      id: id,
      name: product.name,
      quantity: productQuanity,
      price: product.price,
    };
    this.adminService.updateProduct(product.id, product).subscribe({
      next: () => {
        console.log('Product updated');
        this.loadInventory();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  increaseProductCount(id: string, product: any) {
    let productQuanity = product.quantity;
    productQuanity++;
    product = {
      id: id,
      name: product.name,
      quantity: productQuanity,
      price: product.price,
    };
    this.adminService.updateProduct(product.id, product).subscribe({
      next: () => {
        console.log('Product updated');
        this.loadInventory();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  addProductToInventory() {
    if (this.newProduct.name !== '' && !this.newProduct.quantity) {
      alert('Product quantity should be greater than zero');
      return;
    }
    this.isLoading = true;
    this.adminService.addProduct(this.newProduct).subscribe({
      next: () => {
        this.isLoading = false;
        this.loadInventory();

        this.newProduct = {
          name: '',
          quantity: 0,
          price: 0,
        };
        alert('Product Added');
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
      },
    });
  }
  deleteProduct(id: string) {
    this.isLoading = true;
    this.adminService.deleteProduct(id).subscribe({
      next: () => {
        this.isLoading = false;
        this.loadInventory();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }
}
