import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { CompetitionHandlerService } from '../competition.handler.service';
import { CompetitionImporterService } from '../competition-importer.service';
import { AuthService } from '../auth.service';
import { GlobalUpdateService } from '../global-update.service';
import { Competition } from '../models/competition.model';
import { Test } from '../models/test.model';
import { FormsModule } from '@angular/forms';
import { Venue } from '../models/venue.model';
import { NgbTypeahead, NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Observable, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { Alert } from '../models/alert.model';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private competitionHandler: CompetitionHandlerService,
              private competitionImporter: CompetitionImporterService,
              private auth: AuthService,
              private updateHandler: GlobalUpdateService,
              private route: ActivatedRoute) { }
  tests: Test[];           
  currentCompetition: Competition = null;
  addVenue;
  allVenues: Venue[] = [];
  newUserName: string = '';
  newUserPass: string = '';

  
  alert = new Alert('', '');

  
  @ViewChild('venues', { static: false }) instance: NgbTypeahead;
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
        this.competitionHandler.getTests(this.currentCompetition._links.self).subscribe(
          res => this.tests = res
        )
      }
    );

    this.competitionHandler.getAllVenues().subscribe(
      venues => this.allVenues = venues
    )
  }



  deleteCompetition() {
    this.competitionHandler.deleteCompetition(this.currentCompetition._links.self).subscribe(
      (res) => {
        localStorage.setItem('currentCompetition', null);
      },
      (err) => console.log(err)
    )
  }

  saveCompetition(startDate, endDate) {
    this.currentCompetition.startdate = new Date(startDate);
    this.currentCompetition.enddate = new Date(endDate);
    this.competitionHandler.updateCompetition(this.currentCompetition._links.self, this.currentCompetition).subscribe(
      res => this.currentCompetition = res,
      err => console.log(err)
    )
  }

  removeVenue(venue: Venue) {
    this.currentCompetition.venues.splice(this.currentCompetition.venues.indexOf(venue),1);
    let c = new Competition();
    c.venue = venue.name;
    this.competitionHandler.updateCompetition(this.currentCompetition._links.self, c).subscribe(
      res => console.log('Success'),
      err => console.log(err)
    )
  }

  venueChange(e) {
    this.addVenue = '';
    let c = new Competition();
    c.venue = e.item.name;

    this.competitionHandler.updateCompetition(this.currentCompetition._links.self, c).subscribe(
      res => {
        console.log('Success')
        this.currentCompetition.venues.push(e.item);
      },
      err => console.log(err)
    )
  }

  createUser() {
    this.auth.getUser(this.newUserName).subscribe(
      res => {
        this.alert.message = 'The username is already in use.'
        this.alert.type = 'primary';
      },
      err => {
        if(err.status === 404 && this.newUserName && this.newUserPass) {
          this.auth.createUser(this.newUserName, this.newUserPass).subscribe(
            user => {
              console.log('User created', user);
              let c = new Competition();
              c.user = user.id;
      
              this.competitionHandler.updateCompetition(this.currentCompetition._links.self, c).subscribe(
                res => this.currentCompetition = res,
                err => console.log(err)
              )
            },
            err => console.log(err)
          );
        } else {
          this.alert.message = 'Please fill in all fields.';
          this.alert.type = 'warning';
        }
      }
    )
  }

}
