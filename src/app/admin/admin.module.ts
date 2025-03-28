import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminProfileComponent } from './components/admin-profile/admin-profile.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { ManageOrdersComponent } from './components/manage-orders/manage-orders.component';
import { NavbarAdminComponent } from './components/navbar-admin/navbar-admin.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'inventory', pathMatch: 'full' },
      { path: 'inventory', component: InventoryComponent },
      { path: 'profile', component: AdminProfileComponent },
      { path: 'manage-orders', component: ManageOrdersComponent },
    ],
  },
];
@NgModule({
  declarations: [
    AdminProfileComponent,
    InventoryComponent,
    ManageOrdersComponent,
    NavbarAdminComponent,
  ],
  imports: [CommonModule, FormsModule, RouterModule.forChild(adminRoutes)],
})
export class AdminModule {}
