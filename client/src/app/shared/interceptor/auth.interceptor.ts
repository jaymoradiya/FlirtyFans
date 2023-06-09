import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
  HttpEventType,
} from '@angular/common/http';
import {
  Observable,
  catchError,
  exhaustMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.authService.currentUser$.pipe(
      take(1),
      exhaustMap((res) => {
        let newRequest;
        if (res) {
          newRequest = request.clone({
            headers: request.headers.append(
              'Authorization',
              'Bearer ' + res.token
            ),
          });
        } else {
          newRequest = request.clone();
        }

        return next.handle(newRequest).pipe();
      })
    );
  }
}
