import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Route,
  ActivatedRoute,
} from '@angular/router';
import { Observable, map, of, take } from 'rxjs';
import { UserService } from '../services/user.service';
import { Member } from '../models/member.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class MemberResolver implements Resolve<Member> {
  constructor(private userService: UserService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Member> {
    return this.userService.getMember(route.params['id']).pipe(
      take(1),
      map((res) => {
        return res.data;
      })
    );
  }
}
