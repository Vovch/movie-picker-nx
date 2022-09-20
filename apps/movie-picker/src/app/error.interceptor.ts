import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Store} from '@ngrx/store';
import {showErrorMessage} from './error/error.actions';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private store: Store) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMsg = '';
            if (error.error instanceof ErrorEvent) {
                console.log('This is client side error');
                errorMsg = `Error: ${error.error.message}`;
            } else {
                console.log('This is server side error');
                errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
            }

            this.store.dispatch(showErrorMessage({message: 'Something went wrong.'}))
            console.log(errorMsg);
            return throwError(() => errorMsg);
        }),
    );
  }
}
