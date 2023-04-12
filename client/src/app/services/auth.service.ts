import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { UserAuthModel } from '../models/user-auth.model';
import { ApiResponse } from '../models/api-response.model';
import { Router } from '@angular/router';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  api = environment.api;
  private currentUser: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUser.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private presenceService: PresenceService
  ) {}

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
    this.setCurrentUser(user);
    this.currentUser.next(user);
    // this.router.navigateByUrl('/members');
  }

  logout() {
    localStorage.removeItem('userData');
    this.currentUser.next(null);
    this.presenceService.stopHubConnection();
    this.router.navigate(['']);
  }

  handleAuthentication(res: ApiResponse<User>) {
    console.log('auth', res.data);
    this.setCurrentUser(res.data);
  }

  setCurrentUser(user: User) {
    localStorage.setItem('userData', JSON.stringify(user));
    this.presenceService.createHubConnection(user);
    this.currentUser.next(user);
  }
}
