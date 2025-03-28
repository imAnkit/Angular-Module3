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
  ngOnInit(): void {}
  loadOrders() {
    this.adminService.loadOrders().subscribe({
      next: (list) => {
        this.orders = list;
        console.log(this.orders);
      },
      error: (error) => {},
    });
  }
  updateOrder() {}
  deleteOrder(id: string) {}
}
