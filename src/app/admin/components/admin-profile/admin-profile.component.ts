import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css'],
})
export class AdminProfileComponent implements OnInit {
  userInput = {
    name: '',
    address: '',
    phone: '',
    pincode: '',
    email: '',
    id: '',
    type: '',
  };
  constructor(private adminService: AdminService) {}
  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    this.adminService.getUserDetails().subscribe({
      next: (user) => {
        this.userInput = user;
        console.log(user);
      },
    });
  }

  onSubmit() {
    if (!this.userInput) {
      alert('Fill all the details correctly');
      return;
    }
    this.adminService.updateUser(this.userInput.id, this.userInput).subscribe({
      next: () => {
        alert('User Updated');
        console.log(this.userInput);

        this.loadUser();
      },
    });
  }
}
