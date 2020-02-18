import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompetitionHandlerService } from '../competition.handler.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { Competition } from '../models/competition.model';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit {
  isLoggedIn: boolean;
  currentUser: User;
  activeCompetitionUri: string;

  @ViewChild("modal", null) modal;

  constructor(
    private auth: AuthService,
    private modalService: NgbModal,
    private competitionHandler: CompetitionHandlerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.isLoggedIn = this.auth.isLoggedIn();

    this.competitionHandler.getCurrentUser().subscribe(
      user => {
        this.currentUser = user;
        this.setCurrentCompetition();
      },
      err => {
        this.router.navigateByUrl('/login');
      }
    );
  }

  logout() {
    this.isLoggedIn = false;
    this.auth.logout();
  }

  openVerticallyCentered(content) {
    this.modalService.open(content, { centered: true }).result.then(
      (result) => {
      }
    );
  }

  setCurrentCompetition() {
    this.competitionHandler.getCurrentCompetition().subscribe(
      competition => {
        if (competition) this.activeCompetitionUri = competition._links.self;
        else this.openVerticallyCentered(this.modal);
      },
      err => {
        console.log(err);
        this.openVerticallyCentered(this.modal);
      }
    );
  }

  competitionCreated(competition: Competition) {
    this.currentUser.competitions.push(competition);
  }
}
