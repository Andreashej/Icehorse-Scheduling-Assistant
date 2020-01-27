import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import 'rxjs/operators/map';
import { environment } from '../environments/environment';

import { Competition } from './models/competition.model';
import { User } from './models/user.model';
import { Test } from './models/test.model';
import { Venue } from './models/venue.model';

@Injectable()
export class CompetitionHandlerService {

  constructor(private http: HttpClient) { }
  serverUrl = environment.apiEndpoint;

  changeCompetition: BehaviorSubject<Competition> = null;

  setCurrentCompetition(uri) {
    localStorage.setItem('currentCompetition', uri);
  }

  getCurrentCompetition(): Observable<Competition> {
    if (localStorage.getItem("currentCompetition")) {
      return this.getCompetition(localStorage.getItem('currentCompetition'));
    } else {
      return new Observable<Competition>();
    }
  }

  getSettings(): Observable<any> {
    return this.http.get(this.serverUrl);
  }

  getCompetitions(): Observable<Competition[]> {
    return this.http.get<Competition[]>(`${this.serverUrl}/api/competitions`);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<any>(`${this.serverUrl}/api/user`).pipe(
      map(res => new User().deserialize(res.response))
    );
  }

  createCompetition(competition: Competition): Observable<Competition> {
    return this.http.post<any>(`${this.serverUrl}/api/competitions`, competition).pipe(
      map(res => new Competition().deserialize(res.response))
    )
  }

  getCompetition(uri: string): Observable<Competition> {
    return this.http.get<any>(`${this.serverUrl}${uri}`).pipe(
      map(res => new Competition().deserialize(res.response))
    );
  }

  deleteCompetition(uri: string): Observable<any> {
    return this.http.delete<any>(`${this.serverUrl}${uri}`);
  }

  updateCompetition(uri: string, competition: Competition): Observable<Competition> {
    return this.http.put<any>(`${this.serverUrl}${uri}`, competition).pipe(
      map(res => new Competition().deserialize(res.response))
    );
  }

  createTest(uri: string, test: Test): Observable<Test> {
    return this.http.post<any>(`${this.serverUrl}${uri}/tests`, test).pipe(
      map(res => new Test().deserialize(res.response))
    )
  }

  getTests(uri: string): Observable<Test[]> {
    return this.http.get<any>(`${this.serverUrl}${uri}/tests`).pipe(
      map(res => {
        let tests: Test[] = [];
        for (let test of res.response) {
          tests.push(new Test().deserialize(test));
        }

        return tests;
      })
    );
  }

  deleteTest(uri: string): Observable<any> {
    return this.http.delete<any>(`${this.serverUrl}${uri}`);
  }

  updateTest(uri: string, test: Test): Observable<Test> {
    return this.http.put<any>(`${this.serverUrl}${uri}`, test).pipe(
      map(res => new Test().deserialize(res.response))
    );
  }

  getAllVenues(): Observable<Venue[]> {
    return this.http.get<any>(`${this.serverUrl}/api/competitions/0/venues`).pipe(
      map(res => {
        let venues: Venue[] = [];
        for (let venue of res.response) {
          venues.push(new Venue().deserialize(venue));
        }
        return venues;
      })
    )
  }
}
