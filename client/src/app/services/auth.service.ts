import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { User } from '../models/user.model';
import { UserAuthModel } from '../models/user-auth.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  api = environment.api;

  user = new BehaviorSubject<User | null>(null);
  constructor(private http: HttpClient) {}

  login(user: UserAuthModel): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(
      this.api.baseUrl + 'account/login',
      user
    );
  }

  register(user: UserAuthModel): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(
      this.api.baseUrl + 'account/register',
      user
    );
  }
}
