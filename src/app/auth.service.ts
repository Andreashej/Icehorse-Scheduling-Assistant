import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import {tap, shareReplay, map} from 'rxjs/internal/operators';
import * as jwt_decode from 'jwt-decode';
import * as moment from "moment";
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  serverUrl = 'https://api.andreashej.com';

  constructor(private http: HttpClient,
              private router: Router) { }

  login(username: string, password: string) {
    return this.http.post(`${this.serverUrl}/api/login`, {username, password}).pipe(
      tap(res => this.setSession(res)),
      shareReplay()
    )
  }

  private setSession(authResult) {
    // console.log("Session set");
    localStorage.setItem("accessToken", authResult.access_token);
    localStorage.setItem("refreshToken", authResult.refresh_token);
  }

  logout() {
    this.logoutAccess().subscribe(
      () => this.logoutRefresh().subscribe(
        () => {
          console.log('Logged out');
          this.router.navigateByUrl('/login')
        },
        (err) => {
          console.log('Logged out access only');
          this.router.navigateByUrl('/login')
        }
      ),
      (err) => this.logoutRefresh().subscribe(
        () => {
          console.log('Logged out refresh only');
          this.router.navigateByUrl('/login')
        },
        (err) => {
          console.log('Failed logout refresh and access');
          this.router.navigateByUrl('/login')
        }
      )
    );
  }

  logoutAccess() {
    return this.http.post(`${this.serverUrl}/api/logout/access`, {}).pipe(
      tap(() => localStorage.removeItem('accessToken'))
    );
  }

  logoutRefresh() {
    return this.http.post(`${this.serverUrl}/api/logout/refresh`, {}).pipe(
      tap(() => localStorage.removeItem('refreshToken'))
    );
  }

  refreshToken() {
    return this.http.post<any>(`${this.serverUrl}/api/token/refresh`, {}).pipe(
      tap(res => {
        localStorage.setItem("accessToken", res.access_token);
      })
    );
  }

  isLoggedIn() {
    return moment().isBefore(this.getAccessExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getAccessExpiration() {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return null
    }
    let decoded;
    try {
      decoded = jwt_decode(token)
    } catch {
      return null
    }

    const date = new Date(0); 
    date.setUTCSeconds(decoded.exp);
    return date;
  }
}
