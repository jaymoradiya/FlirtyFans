import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.userSubject.subscribe({
      next: (user) => {
        this.isLoggedIn = !!user;
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
