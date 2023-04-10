import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member.model';
import { ApiResponse } from '../models/api-response.model';
import { PaginationResult } from '../models/pagination.model';
import { UserParams } from '../models/userparams.model';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import {
  getPaginationParams,
  getPaginationResult,
} from '../helpers/paginnation-helper';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  BaseUrl = environment.api.baseUrl;
  membersCaches = new Map<string, PaginationResult<Member[]>>();

  private userParams: UserParams | undefined;
  private user: User | undefined;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
          this.userParams = new UserParams(user);
        }
      },
    });
  }

  getUsers(
    userParams: UserParams
  ): Observable<PaginationResult<Member[]> | null> {
    const result = this.membersCaches.get(Object.values(userParams).join('-'));
    if (result) return of(result);

    let params = getPaginationParams(userParams);

    return getPaginationResult<Member[]>(
      this.BaseUrl + 'users',
      params,
      this.http
    ).pipe(
      map((res) => {
        if (res.data) {
          this.membersCaches.set(Object.values(userParams).join('-'), res);
        }
        return res;
      })
    );
  }

  getMember(id: number): Observable<ApiResponse<Member>> {
    const members = [...this.membersCaches.values()].reduce(
      (acc: Member[], crr) => acc.concat(...crr.data),
      []
    );
    const member = members.find((u) => u.id == id);
    if (member) return of({ data: member } as ApiResponse<Member>);
    return this.http.get<ApiResponse<Member>>(this.BaseUrl + 'users/' + id);
  }

  updateUser(member: Member) {
    return this.http
      .put<ApiResponse<string>>(this.BaseUrl + 'users', member)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.BaseUrl + 'users/delete-photo/' + photoId);
  }

  addLike(userId: number) {
    return this.http.post(this.BaseUrl + 'likes/' + userId, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('predicate', predicate);
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);

    return getPaginationResult<Member[]>(
      this.BaseUrl + 'likes',
      params,
      this.http
    );
  }
  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  getUserParams() {
    return this.userParams;
  }

  resetUserParams() {
    if (this.user) {
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }
    return;
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.BaseUrl + 'users/set-main-photo/' + photoId, {});
  }
}
