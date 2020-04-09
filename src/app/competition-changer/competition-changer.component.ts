import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Competition } from '../models/competition.model';
import { CompetitionHandlerService } from '../competition.handler.service';
import { Alert } from '../models/alert.model';

@Component({
  selector: 'app-competition-changer',
  templateUrl: './competition-changer.component.html',
  styleUrls: ['./competition-changer.component.css']
})
export class CompetitionChangerComponent implements OnInit {
  @Output() close = new EventEmitter;
  @Output() create = new EventEmitter;

  @Input() competitions: Competition[];
  @Input() activeCompetitionUri: string;

  createNew = false;
  alert: Alert;

  constructor(
    private competitionHandler: CompetitionHandlerService
  ) { }

  ngOnInit() {
    this.createNew = false;
    console.log(this.activeCompetitionUri);
  }

  modalDismiss(e?) {
    this.createNew = false;
    this.close.emit(e);
  }

  handleCompetitionChange(uri) {
    this.competitionHandler.setCurrentCompetition(uri);
    // this.setCurrentCompetition();
    window.location.reload();
  }

  createCompetition(name: string, startDate: string, endDate: string) {
    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);

    const competition = new Competition(name, newStart, newEnd);
    this.competitionHandler.createCompetition(competition).subscribe(
      response => {
        this.createNew = false;
        this.create.emit(response);
      },
      error => this.alert = new Alert(error.error.response, 'danger')
    )
  }

}
