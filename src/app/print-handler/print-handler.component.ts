import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { CompetitionHandlerService } from '../competition.handler.service';
import { FormsModule } from '@angular/forms';
import { CompetitionImporterService } from '../competition-importer.service';
import { Competition } from '../models/competition.model';
import { Test } from '../models/test.model';
import { TestBlock } from '../models/testblock.model';

@Component({
  selector: 'app-print-handler',
  templateUrl: './print-handler.component.html',
  styleUrls: ['./print-handler.component.css']
})
export class PrintHandlerComponent implements OnInit {
  name = '';
  settings;
  template = '';
  judges;
  tests: TestBlock[] = [];

  constructor(private app: AppComponent,
    private competitionHandler: CompetitionHandlerService) { }

    currentCompetition: Competition;

  ngOnInit() {
    this.competitionHandler.getCurrentCompetition().subscribe(
      competition => {
        this.currentCompetition = competition;
        this.competitionHandler.getSchedule(this.currentCompetition._links.schedule).subscribe(
          tests => this.tests = tests
        );
      }
    );
  }

  // getJudges() {
  //   this.competitionImporter.getAllJudges().subscribe(
  //     judgelist => this.judges = judgelist,
  //     () => console.log('Could not retrieve judges')
  //   );
  // }

  // getSettings(): void {
  //   this.settingsProvider.getSettings().subscribe(
  //     data => this.settings = data,
  //     error => console.log('Error when fetching data'),
  //     () => console.log('Got settings')
  //   );
  // }

  toDate(day): Date {
    return new Date(day);
  }

  getTestsByDay(day): TestBlock[] {
    return this.tests.filter(test => test.starttime.getDate() === day.getDate());
  }

  print(): void {
    setTimeout( () => window.print(), 100);
  }

}
