import { Component, OnInit, Input } from '@angular/core';
import { CompetitionHandlerService } from '../competition.handler.service';
import { Competition } from '../models/competition.model';

@Component({
  selector: 'app-page-container',
  templateUrl: './page-container.component.html',
  styleUrls: ['./page-container.component.css']
})
export class PageContainerComponent implements OnInit {

  @Input() title: string;
  @Input() cssClass: string;
  @Input() competition: Competition;

  constructor(
    private competitionHandler: CompetitionHandlerService
  ) { }

  ngOnInit() {
    this.competitionHandler.getCurrentCompetition().subscribe(
      competition => this.competition = competition
    );
  }

}
