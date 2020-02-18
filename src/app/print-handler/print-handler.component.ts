import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { CompetitionHandlerService } from '../competition.handler.service';
import { FormsModule } from '@angular/forms';
import { CompetitionImporterService } from '../competition-importer.service';
import { Competition } from '../models/competition.model';
import { Test } from '../models/test.model';

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
  tests: Test[] = [];

  constructor(private app: AppComponent,
    private competitionHandler: CompetitionHandlerService) { }

    currentCompetition: Competition;

  ngOnInit() {
    // this.getSettings();
    // this.getJudges();

    this.competitionHandler.getCurrentCompetition().subscribe(
      competition => {
        this.currentCompetition = competition;
        this.competitionHandler.getTests(this.currentCompetition._links.self).subscribe(
          tests => {
            for (let test of tests) {
              // if (test.starttime) {
                this.tests.push(test);
              // }
            }
          }
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

  // getTestsByDay(day): Test[] {
    // return this.tests.filter(test => test.starttime.getDate() === day.getDate());
  // }

  print(): void {
    setTimeout( () => window.print(), 100);
  }

}
