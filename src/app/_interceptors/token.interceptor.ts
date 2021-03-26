import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {switchMap, tap} from 'rxjs/operators';
import {from, Observable, throwError} from 'rxjs';
import {AuthService} from '../_services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.authenticationService.getToken()).pipe(
      switchMap(token => {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next.handle(request).pipe(
          tap(resp => {
          }, error => {
            if (error.status >= 500) {
              // this.toastService.danger('SERVER ERROR!');
            } else if (error.status === 401) {
              this.authenticationService.logout();
            } else {
              if (error.status === 400 || error.status === 403) {
                // this.toastService.danger(error.error.message);
                throwError(error);
              }
            }
          })
        );
      })
    );

  }
}

