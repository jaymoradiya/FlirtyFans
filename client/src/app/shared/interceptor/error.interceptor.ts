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
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 400:
            if (error.error.errors) {
              const modelStateErrors = [];
              for (const key in error.error.errors) {
                if (error.error.errors[key]) {
                  modelStateErrors.push(error.error.errors[key]);
                }
              }
              throw modelStateErrors;
            } else {
              this.toastr.error(error.error, error.status.toString());
            }
            break;
          case 401:
            this.toastr.error('Unauthorised', error.status.toString());
            break;
          case 404:
            this.router.navigateByUrl('/not-found');
            break;
          case 500:
            const navigationExtras = { state: { error: error.error } };
            this.router.navigateByUrl('/server-error', navigationExtras);
            break;

          default:
            this.toastr.error('Something unexpected went wrong');
            console.log(error);
            break;
        }
        throw error;
      })
    );
  }
}
