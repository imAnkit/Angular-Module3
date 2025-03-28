import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent implements OnInit {
  inventory: any[] = [];
  constructor(private adminService: AdminService) {}
  ngOnInit(): void {
    this.adminService.loadInventory().subscribe((inventoryList) => {
      this.inventory = inventoryList;
    });
  }
}
