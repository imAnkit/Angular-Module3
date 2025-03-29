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
  isLoading = false;
  constructor(private adminService: AdminService) {}
  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    this.isLoading = true;
    this.adminService.getUserDetails().subscribe({
      next: (user) => {
        this.userInput = user;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error while fetching user.', err);
        this.isLoading = false;
      },
    });
  }

  onSubmit() {
    if (!this.userInput) {
      alert('Fill all the details correctly');
      return;
    }
    this.isLoading = true;
    this.adminService.updateUser(this.userInput.id, this.userInput).subscribe({
      next: () => {
        alert('User Updated');
        console.log(this.userInput);
        this.isLoading = false;
        this.loadUser();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }
}
