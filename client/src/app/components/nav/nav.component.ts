import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  isLoggedIn = false;
  user: User | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser$.subscribe({
      next: (user) => {
        this.isLoggedIn = !!user;
        this.user = user;
      },
    });
  }

  onAuth() {
    if (this.isLoggedIn) {
      this.authService.logout();
      return;
    }

    this.router.navigate(['auth/login']);
  }
}
