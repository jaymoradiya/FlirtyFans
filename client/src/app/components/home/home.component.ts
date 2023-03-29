import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  isLoggedIn = false;
  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser$.subscribe({
      next: (user) => (this.isLoggedIn = !!user),
    });
  }

  onRegister() {
    this.router.navigate(['auth/signup']);
  }
}
