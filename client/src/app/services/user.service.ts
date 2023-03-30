import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  BaseUrl = environment.api.baseUrl;
  members: Member[] = [];

  constructor(private http: HttpClient) {}

  getUsers(): Observable<ApiResponse<Member[]>> {
    if (this.members.length > 0)
      return of({
        data: this.members,
      } as ApiResponse<Member[]>);
    return this.http.get<ApiResponse<Member[]>>(this.BaseUrl + 'users').pipe(
      map((res) => {
        this.members = res.data;
        return res;
      })
    );
  }

  getMember(id: number): Observable<ApiResponse<Member>> {
    const member = this.members.find((u) => u.id == id);
    if (member) return of({ data: member } as ApiResponse<Member>);
    return this.http.get<ApiResponse<Member>>(this.BaseUrl + 'users/' + id);
  }

  updateUser(member: Member) {
    return this.http
      .put<ApiResponse<string>>(this.BaseUrl + 'users', member)
      .pipe(
        map((res) => {
          const index = this.members.indexOf(member);
          this.members[index] = { ...this.members[index], ...member };
          return res;
        })
      );
  }
}
