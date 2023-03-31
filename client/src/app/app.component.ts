import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user.model';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'client';
  isLoggedIn = false;

  constructor(private authService: AuthService) {
    authService.currentUser$.subscribe({
      next: (u) => (this.isLoggedIn = !!u),
    });
  }

  ngOnInit(): void {
    this.autoLogin();
  }

  autoLogin() {
    this.authService.autoLogin();
  }
}
