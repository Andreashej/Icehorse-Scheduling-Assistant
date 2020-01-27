import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { AppComponent } from '../app.component';
import { CompetitionHandlerService } from '../competition.handler.service';
import { AuthService } from '../auth.service';
import { User } from '../models/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Alert } from '../models/alert.model';
import { Competition } from '../models/competition.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  currentlink = '/';
  alert = new Alert('','');
  modal;
  currentUser: User = null;
  currentCompetition: Competition = null;
  currentCompetitionUri: string = localStorage.getItem("currentCompetition");

  constructor(public app: AppComponent,
    private competitionHandler: CompetitionHandlerService,
    public authService: AuthService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.competitionHandler.getCurrentUser().subscribe(
      user => {
        this.currentUser = user
      }
    );
    this.setCurrentCompetition();

  }

  handleCompetitionChange() {
    this.competitionHandler.setCurrentCompetition(this.currentCompetitionUri);
    this.setCurrentCompetition();
    window.location.reload();
  }

  openVerticallyCentered(content) {
    this.modalService.open(content, { centered: true }).result.then(
      (result) => {
      }
    );
  }
  
  createCompetition(name: string, startDate: string, endDate: string) {
    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);

    const competition = new Competition(name, newStart, newEnd);
    this.competitionHandler.createCompetition(competition).subscribe(
      response => {
        this.currentUser.competitions.push(response);
        this.modal.close();
      },
      error => this.alert = new Alert(error.error.response, 'danger')
    )
  }

  setCurrentCompetition() {
    this.competitionHandler.getCurrentCompetition().subscribe(
      competition => {
        this.currentCompetition = competition;
        this.currentCompetitionUri = competition.uri;
      },
      err => console.log(err)
    )
  }
}
