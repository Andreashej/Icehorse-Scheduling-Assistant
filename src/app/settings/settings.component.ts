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
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private competitionHandler: CompetitionHandlerService,
              private auth: AuthService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService
              ) { }       
  currentCompetition: Competition = null;
  addVenue;
  allVenues: Venue[] = [];
  newUserName: string = '';
  newUserPass: string = '';

  newStartDate: Date;
  newEndDate: Date;

  
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
        this.newStartDate = new Date(Date.UTC(competition.startdate.getFullYear(), competition.startdate.getMonth(), competition.startdate.getDate()));
        this.newEndDate = new Date(Date.UTC(competition.enddate.getFullYear(), competition.enddate.getMonth(), competition.enddate.getDate()));
      }
    );

    this.competitionHandler.getAllVenues().subscribe(
      venues => this.allVenues = venues
    )
  }



  deleteCompetition() {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete this competition including all tests and schedules?",
      accept: () => {
        this.competitionHandler.deleteCompetition(this.currentCompetition._links.self).subscribe(
          (res) => {
            localStorage.setItem('currentCompetition', null);
            this.messageService.add({severity: 'success', summary: 'Deleted competition', detail: `Successfully deleted ${this.currentCompetition.name}`});
          },
          ({error}) => {
            console.log(error);
            this.messageService.add({severity: 'error', summary: 'Failed to delete competition', detail: error.response});
          }
        );
      }
    })
  }

  saveCompetition() {
    this.currentCompetition.setStartDate(this.newStartDate);
    this.currentCompetition.setEndDate(this.newEndDate);
    
    this.competitionHandler.updateCompetition(this.currentCompetition._links.self, this.currentCompetition).subscribe(
      res => {
        this.currentCompetition = res;
        this.messageService.add({severity: "success", summary: 'Saved competition', detail: `Successfully saved ${this.currentCompetition.name}`})
      },
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
