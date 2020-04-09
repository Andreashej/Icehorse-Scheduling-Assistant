import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import 'rxjs/operators/map';
import { environment } from '../environments/environment';

import { Competition } from './models/competition.model';
import { User } from './models/user.model';
import { Test } from './models/test.model';
import { Venue } from './models/venue.model';
import { TestBlock } from './models/testblock.model';
import { TestFull } from './models/test-full.model';

@Injectable()
export class CompetitionHandlerService {

  constructor(private http: HttpClient) { }
  serverUrl = environment.apiEndpoint;

  changeCompetition: BehaviorSubject<Competition> = null;

  currentCompetition: Competition;

  setCurrentCompetition(uri) {
    localStorage.setItem('currentCompetition', uri);
  }

  getCurrentCompetition(): Observable<Competition> {
    if (localStorage.getItem("currentCompetition")) {
      if(this.currentCompetition) {
        return of(this.currentCompetition);
      }
      return this.getCompetition(localStorage.getItem('currentCompetition'));
    } else {
      return of(null);
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
      map(res => new Competition().deserialize(res.response)),
      tap(competition => this.currentCompetition = competition)
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

  createTest(uri: string, test: Test): Observable<TestFull> {
    return this.http.post<any>(`${this.serverUrl}${uri}/tests`, test).pipe(
      map(res => new TestFull().deserialize(res.response))
    )
  }

  getTests(uri: string): Observable<TestFull[]> {    
    return this.http.get<any>(`${this.serverUrl}${uri}/tests`).pipe(
      map(res => res.response.map(test => new TestFull().deserialize(test)))
    );
  }

  getUnscheduledTests(uri: string): Observable<TestFull[]> {
    return this.http.get<any>(`${this.serverUrl}${uri}/tests/unscheduled`).pipe(
      map(res => res.response.map(test => new TestFull().deserialize(test)))
    );
  }

  createScheduleBlock(uri: string, testblock): Observable<TestBlock> {
    return this.http.post<any>(`${this.serverUrl}${uri}`, testblock).pipe(
      map(res => new TestBlock().deserialize(res.response))
    );
  }

  getSchedule(uri: string): Observable<TestBlock[]> {
    return this.http.get<any>(`${this.serverUrl}${uri}`).pipe(
      map(res => res.response.map(test => new TestBlock().deserialize(test)))
    );
  }

  updateSchedule(uri: string, params: any): Observable<TestBlock> {
    console.log(uri, params);
    return this.http.patch<any>(`${this.serverUrl}${uri}`, params).pipe(
      map(res => new TestBlock().deserialize(res.response))
    );
  }

  deleteTestBlock(uri: string): Observable<any> {
    return this.http.delete<any>(`${this.serverUrl}${uri}`)
  }

  deleteTest(uri: string): Observable<any> {
    return this.http.delete<any>(`${this.serverUrl}${uri}`);
  }

  updateTest(uri: string, test: TestFull): Observable<TestFull> {
    return this.http.put<any>(`${this.serverUrl}${uri}`, test).pipe(
      map(res => new TestFull().deserialize(res.response))
    );
  }

  getAllVenues(): Observable<Venue[]> {
    return this.http.get<any>(`${this.serverUrl}/api/competitions/0/venues`).pipe(
      map(res => res.response.map(venue => new Venue().deserialize(venue)))
    )
  }
}
