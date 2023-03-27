import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.user.pipe(
      take(1),
      map((user) => {
        const isAuth = !!user;

        if (route.url[0].path == 'profile') {
          if (isAuth) {
            return true;
          }
          return this.router.createUrlTree(['/auth']);
        } else if (route.url[0].path == 'auth') {
          if (!isAuth) {
            return true;
          }
          return this.router.createUrlTree(['profile']);
        }
        return this.router.createUrlTree(['']);
      })
    );
  }
}
