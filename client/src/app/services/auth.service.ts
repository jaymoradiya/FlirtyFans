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
  userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(
    null
  );

  constructor(private http: HttpClient, private router: Router) {}

  login(user: UserAuthModel): Observable<ApiResponse<User>> {
    return this.http
      .post<ApiResponse<User>>(this.api.baseUrl + 'account/login', user)
      .pipe(
        map((res) => {
          if (res.status) {
            this.handleAuthentication(res);
          }
          return res;
        })
      );
  }

  register(user: UserAuthModel): Observable<ApiResponse<User>> {
    return this.http
      .post<ApiResponse<User>>(this.api.baseUrl + 'account/register', user)
      .pipe(
        map((res) => {
          if (res.status) {
            this.handleAuthentication(res);
          }
          return res;
        })
      );
  }

  autoLogin() {
    const userString = localStorage.getItem('userData');
    if (!userString) return;
    const user = JSON.parse(userString);
    this.router.navigate(['profile']);
    this.userSubject.next(user);
  }

  logout() {
    localStorage.removeItem('userData');
    this.userSubject.next(null);
    this.router.navigate(['']);
  }

  handleAuthentication(res: ApiResponse<User>) {
    console.log('auth', res.data);
    localStorage.setItem('userData', JSON.stringify(res.data));
    this.userSubject.next(res.data);
  }
}
