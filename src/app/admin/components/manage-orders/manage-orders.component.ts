import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css'],
})
export class ManageOrdersComponent implements OnInit {
  orders: any[] = [];
  isLoading = false;
  constructor(private adminService: AdminService) {}
  ngOnInit(): void {
    this.loadOrders();
  }
  loadOrders() {
    this.isLoading = true;
    this.adminService.loadOrders().subscribe({
      next: (list) => {
        this.orders = list;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
      },
    });
  }
  updateStatus(id: string, order: any) {
    this.adminService.updateOrder(id, order).subscribe({
      next: () => {
        console.log('Order Updated');
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  deleteOrder(id: string) {}
}
