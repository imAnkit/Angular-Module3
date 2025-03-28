import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { CartComponent } from './components/cart/cart.component';
import { TrackOrderComponent } from './components/track-order/track-order.component';
import { AdminProfileComponent } from '../admin/components/admin-profile/admin-profile.component';
import { RouterModule, Routes } from '@angular/router';
import { AdminModule } from '../admin/admin.module';
import { FormsModule } from '@angular/forms';
import { NavbarUserComponent } from './components/navbar-user/navbar-user.component';
const userRoutes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: '', redirectTo: 'catalog', pathMatch: 'full' },
      { path: 'catalog', component: CatalogComponent },
      { path: 'cart', component: CartComponent },
      { path: 'track-order', component: TrackOrderComponent },
      { path: 'profile', component: AdminProfileComponent },
    ],
  },
];

@NgModule({
  declarations: [
    UserComponent,
    CatalogComponent,
    CartComponent,
    TrackOrderComponent,
    NavbarUserComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(userRoutes), FormsModule],
})
export class UserModule {}
