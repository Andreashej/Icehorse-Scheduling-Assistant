import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { CompetitionHandlerService } from '../competition.handler.service';
import { Competition } from '../models/competition.model';
import { ActivatedRoute, Router, ActivationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgbTooltip, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-page-container',
  templateUrl: './page-container.component.html',
  styleUrls: ['./page-container.component.css']
})
export class PageContainerComponent implements OnInit {

  @Input() title: string;
  @Input() cssClass: string;

  hideControls: Boolean = false;

  isLoggedIn;
  currentUser: User;
  competition: Competition;

  showCompetitionChanger: boolean = false;
  showUserEdit: boolean = false;

  activeCompetitionUri: string;

  @ViewChild("competitionModal", null) modal;

  constructor(
    private competitionHandler: CompetitionHandlerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
  ) {
    this.router.events.pipe(filter(event => event instanceof ActivationEnd)).subscribe(
      (route: ActivatedRoute) => {
        this.title = route.snapshot.data.name;
        this.hideControls = route.snapshot.data.hideControls;
      }
    );

    this.auth.loggedOut.subscribe(
      res => {
        if (res) {
          this.isLoggedIn = false;
          this.currentUser = null;
        }
      }
    )

   }

  ngOnInit() {
    this.activatedRoute.data.subscribe(
      data => {
        this.title = data.name;
        this.hideControls = data.hideControls;
      }
    );

    this.competitionHandler.getCurrentUser().subscribe(
      user => {
        this.currentUser = user;
        this.setCurrentCompetition();
      },
      err => {
        this.router.navigateByUrl('/login');
      },
      () => {
        this.isLoggedIn = this.auth.isLoggedIn();
      }
    );
  }

  setCurrentCompetition() {
    this.competitionHandler.getCurrentCompetition().subscribe(
      competition => {
        if (competition) this.competition = competition;
        else this.showCompetitionChanger = true;
      },
      err => {
        console.log(err);
        this.showCompetitionChanger = true;
      }
    );
  }

  competitionCreated(competition: Competition) {
    this.currentUser.competitions.push(competition);
  }

  updateUser(user: User) {
    this.currentUser = user;
    console.log(this.currentUser);
  }

}
