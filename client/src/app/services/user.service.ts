import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member.model';
import { ApiResponse } from '../models/api-response.model';
import { PaginationResult } from '../models/pagination.model';
import { UserParams } from '../models/userparams.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  BaseUrl = environment.api.baseUrl;
  members: Member[] = [];

  constructor(private http: HttpClient) {}

  getUsers(
    userParams: UserParams
  ): Observable<PaginationResult<Member[]> | null> {
    let params = this.getPaginationParams(userParams);

    return this.getPaginationResult<Member[]>(this.BaseUrl + 'users', params);
  }

  private getPaginationResult<T>(url: string, params: HttpParams) {
    let paginationResult: PaginationResult<T> = new PaginationResult<T>();

    return this.http
      .get<ApiResponse<T>>(url, {
        observe: 'response',
        params: params,
      })
      .pipe(
        map((res) => {
          if (res.body) {
            paginationResult.data = res.body.data;
          }
          const pagination = res.headers.get('Pagination');
          if (pagination) {
            paginationResult.pagination = JSON.parse(pagination);
          }
          return paginationResult;
        })
      );
  }

  private getPaginationParams(userParams: UserParams) {
    let params = new HttpParams();

    params = params.append('pageNumber', userParams.pageNumber);
    params = params.append('pageSize', userParams.pageSize);
    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    return params;
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
