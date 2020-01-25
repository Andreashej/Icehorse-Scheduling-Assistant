import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import 'rxjs/add/operator/catch';
import { catchError, switchMap, finalize, filter, take, isEmpty } from 'rxjs/operators';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/switchMap';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    isRefreshingToken: boolean = false;
    tokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor (private authService: AuthService) {}

    intercept(req: HttpRequest<any>,
              next: HttpHandler): Observable<HttpEvent<any>> {
        // console.log(req.url);
        let token;
        if ( req.url.includes('refresh') ) {
            token = localStorage.getItem('refreshToken');
        } else {
            token = localStorage.getItem('accessToken')
        }

        return next.handle(this.setAuthHeader(req, token))
            .pipe(
                catchError(error => {
                    if (
                        req.url.includes('token/refresh') ||
                        req.url.includes('login') || req.url.includes('logout')
                    ) {
                        if (req.url.includes('token/refresh')) {
                            this.authService.logout(); 
                        }

                        return throwError(error);
                    }
                    if (error.status !== 401) {
                        return throwError(error);
                    }
                    if (this.isRefreshingToken) {

                        return this.tokenSubject
                            .filter(result => result !== null)
                            .take(1)
                            .switchMap(
                                () => next.handle(this.setAuthHeader(req, localStorage.getItem('accessToken')))
                            );
                    } else {
                        this.isRefreshingToken = true;

                        this.tokenSubject.next(null);

                        return this.authService.refreshToken().switchMap(
                            (token: any) => {
                                this.isRefreshingToken = false;
                                this.tokenSubject.next(token);
                                return next.handle(this.setAuthHeader(req, localStorage.getItem("accessToken")));
                            }
                        ).catch((err: any) => {
                            this.isRefreshingToken = false;
                            this.authService.logout();
                            return throwError(err);
                        });
                    }
                })
        );
    }

    setAuthHeader(req, token) {
        if (!token) return req;
        return req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
    }
}