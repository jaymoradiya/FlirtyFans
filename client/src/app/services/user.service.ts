import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member.model';
import { ApiResponse } from '../models/api-response.model';
import { PaginationResult } from '../models/pagination.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  BaseUrl = environment.api.baseUrl;
  members: Member[] = [];
  paginationResult: PaginationResult<Member[]> = new PaginationResult<
    Member[]
  >();

  constructor(private http: HttpClient) {}

  getUsers(
    page: number = 1,
    itemPerPage: number = 10
  ): Observable<PaginationResult<Member[]> | null> {
    let params = new HttpParams();

    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemPerPage);

    // if (this.members.length > 0)
    //   return of({
    //     data: this.members,
    //   } as ApiResponse<Member[]>);

    return this.http
      .get<ApiResponse<Member[]>>(this.BaseUrl + 'users', {
        observe: 'response',
        params: params,
      })
      .pipe(
        // map((res) => {
        //   this.members = res.data;
        //   return res;
        // })
        map((res) => {
          if (res.body) {
            this.paginationResult.data = res.body.data;
          }
          const pagination = res.headers.get('Pagination');
          if (pagination) {
            this.paginationResult.pagination = JSON.parse(pagination);
          }
          return this.paginationResult;
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

  setMainPhoto(photoId: number) {
    return this.http.put(this.BaseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.BaseUrl + 'users/delete-photo/' + photoId);
  }
}
