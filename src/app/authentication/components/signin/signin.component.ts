import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/Models/user';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  userInput = {
    email: '',
    password: '',
  };

  isLoading = false;
  errorMessage = '';
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onSubmit() {
    this.isLoading = true;
    this.authService.signin(this.userInput).subscribe({
      next: (user: User) => {
        this.isLoading = false;
        const type = user.type.toLowerCase();
        if (user.name === '') {
          this.router.navigate(['../../', `${type}/profiledetails`], {
            relativeTo: this.route,
          });
        } else {
          this.router.navigate(['../../', type], { relativeTo: this.route });
        }
      },
      error: (error: Error) => {},
    });
  }
  toSignUp() {
    this.router.navigate(['../', 'signup'], { relativeTo: this.route });
  }
}
