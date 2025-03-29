import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  userInput = {
    email: '',
    password: '',
    type: '',
  };

  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onSubmit() {
    this.isLoading = true;
    this.authService.signup(this.userInput).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['../', 'signin'], { relativeTo: this.route });
      },
      error: (error) => {
        this.isLoading = false;
      },
    });
  }
  toSignIn() {
    this.router.navigate(['../', 'signin'], { relativeTo: this.route });
  }
}
