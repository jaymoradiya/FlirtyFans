import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  BaseUrl = environment.api.baseUrl;
  constructor(private http: HttpClient) {}

  getUsers(): Observable<ApiResponse<Member[]>> {
    return this.http.get<ApiResponse<Member[]>>(this.BaseUrl + 'users');
  }

  getMember(id: number): Observable<ApiResponse<Member>> {
    return this.http.get<ApiResponse<Member>>(this.BaseUrl + 'users/' + id);
  }

  updateUser(member: Member) {
    return this.http.put<ApiResponse<string>>(this.BaseUrl + 'users', member);
  }
}
