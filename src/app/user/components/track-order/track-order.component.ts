import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { LocalAuthService } from 'src/app/authentication/services/local-auth.service';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrls: ['./track-order.component.css'],
})
export class TrackOrderComponent implements OnInit {
  orders: any[] = [];
  userId: string | undefined = undefined;
  constructor(
    private userService: UserService,
    private localAuthService: LocalAuthService
  ) {}
  ngOnInit(): void {
    this.userId = this.localAuthService.getUserId();
    this.loadOrders();
  }
  loadOrders() {
    this.userService.loadAllOrders().subscribe({
      next: (list) => {
        list.filter((item) => {
          item.userId === this.userId;
        });
        this.orders = list;
        console.log(list);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
