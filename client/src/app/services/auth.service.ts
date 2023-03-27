import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { User } from '../models/user.model';
import { UserAuthModel } from '../models/user-auth.model';
import { ApiResponse } from '../models/api-response.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  api = environment.api;
  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  login(user: UserAuthModel): Observable<ApiResponse<User>> {
    return this.http
      .post<ApiResponse<User>>(this.api.baseUrl + 'account/login', user)
      .pipe(map(this.handleAuthentication));
  }

  register(user: UserAuthModel): Observable<ApiResponse<User>> {
    return this.http
      .post<ApiResponse<User>>(this.api.baseUrl + 'account/register', user)
      .pipe(map(this.handleAuthentication));
  }

  autoLogin() {
    const userString = localStorage.getItem('userData');
    if (!userString) return;
    const user = JSON.parse(userString);
    this.user.next(user);
    this.router.navigate(['profile']);
  }

  logout() {
    localStorage.removeItem('userData');
    this.user.next(null);
    this.router.navigate(['']);
  }

  handleAuthentication(res: ApiResponse<User>) {
    console.log(res);
    if (res.status) {
      localStorage.setItem('userData', JSON.stringify(res.data));
      this.user.next(res.data);
    }
    return res;
  }
}
