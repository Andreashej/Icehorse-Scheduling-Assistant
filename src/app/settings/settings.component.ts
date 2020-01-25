import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { CompetitionHandlerService } from '../competition.handler.service';
import { CompetitionImporterService } from '../competition-importer.service';
import { GlobalUpdateService } from '../global-update.service';
import { Competition } from '../models/competition.model';
import { Test } from '../models/test.model';
import { FormsModule } from '@angular/forms';
import { Venue } from '../models/venue.model';
import { NgbTypeahead, NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Observable, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private competitionHandler: CompetitionHandlerService,
              private competitionImporter: CompetitionImporterService,
              private updateHandler: GlobalUpdateService) { }
  tests: Test[];           
  currentCompetition: Competition = null;
  addVenue;
  allVenues: Venue[] = [];

  
  @ViewChild('venues') instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  
  venueSearch = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;
    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => {
        if (term === '') {
          return this.allVenues;
        } else {
          return this.allVenues.filter(
            v => {
              return v.name.toLowerCase().indexOf(term.toLowerCase()) > -1
            }).slice(0,10);
        }
      }
    ));
  }

  formatter = (x: {name: string}) => x.name;

  ngOnInit() {
    this.competitionHandler.getCurrentCompetition().subscribe(
      competition => {
        this.currentCompetition = competition;
        this.competitionHandler.getTests(this.currentCompetition.uri).subscribe(
          res => this.tests = res
        )
      }
    );

    this.competitionHandler.getAllVenues().subscribe(
      venues => this.allVenues = venues
    )
  }

  saveTest(testId, testcode, timeperheat, lr, rr) {
    this.competitionImporter.saveTest(testId, testcode, lr, rr, timeperheat).subscribe(
      () => {
        this.competitionImporter.getAllTestData().subscribe(
          data => this.tests = data
        );
      }
    );
  }

  createTest(testcode, lr, rr, base) {
    const test = new Test(testcode, base, lr, rr);
    this.competitionHandler.createTest(this.currentCompetition.uri, test).subscribe(
        res => this.tests.push(res),
        err => console.log(err)
    );
  }

  deleteCompetition() {
    this.competitionHandler.deleteCompetition(this.currentCompetition.uri).subscribe(
      (res) => {
        localStorage.setItem('currentCompetition', null);
      },
      (err) => console.log(err)
    )
  }

  saveCompetition(startDate, endDate) {
    this.currentCompetition.startdate = new Date(startDate);
    this.currentCompetition.enddate = new Date(endDate);
    this.competitionHandler.updateCompetition(this.currentCompetition.uri, this.currentCompetition).subscribe(
      res => this.currentCompetition = res,
      err => console.log(err)
    )
  }

  deleteTest(test: Test) {
    this.competitionHandler.deleteTest(test.uri).subscribe(
      (res) => {
        console.log(res);
        const i = this.tests.findIndex(t => t.uri === test.uri);
        this.tests.splice(i, 1);
      },
      (err) => console.log(err)
    )
  }

  updateTest(test: Test) {
    this.competitionHandler.updateTest(test.uri, test).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }

  removeVenue(venue: Venue) {
    this.currentCompetition.venues.splice(this.currentCompetition.venues.indexOf(venue),1);
    let c = new Competition();
    c.venue = venue.name;
    this.competitionHandler.updateCompetition(this.currentCompetition.uri, c).subscribe(
      res => console.log('Success'),
      err => console.log(err)
    )
  }

  venueChange(e) {
    this.addVenue = '';
    let c = new Competition();
    c.venue = e.item.name;
    
    console.log(c);

    this.competitionHandler.updateCompetition(this.currentCompetition.uri, c).subscribe(
      res => {
        console.log('Success')
        this.currentCompetition.venues.push(e.item);
      },
      err => console.log(err)
    )
  }

}
