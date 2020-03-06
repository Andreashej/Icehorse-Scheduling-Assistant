import { Component, OnInit } from '@angular/core';
import { CompetitionHandlerService } from '../competition.handler.service';
import { Competition } from '../models/competition.model';
import { TestFull } from '../models/test-full.model';
import { GlobalUpdateService } from '../global-update.service';

@Component({
  selector: 'app-test-setup',
  templateUrl: './test-setup.component.html',
  styleUrls: ['./test-setup.component.css']
})
export class TestSetupComponent implements OnInit {
  currentCompetition: Competition;
  tests: TestFull[];

  constructor(
    private competitionHandler: CompetitionHandlerService,
    private updater: GlobalUpdateService
  ) { }

  ngOnInit() {
    this.competitionHandler.getCurrentCompetition().subscribe(
      competition => {
        this.currentCompetition = competition;
        this.competitionHandler.getTests(this.currentCompetition._links.self).subscribe(
          res => this.tests = res
        )
      }
    );
  }

  createTest(testcode, lr, rr, base) {
    const test = new TestFull(testcode, base, lr, rr);
    this.competitionHandler.createTest(this.currentCompetition._links.self, test).subscribe(
        res => this.tests.push(res),
        err => console.log(err)
    );
  }

  updateTest(test: TestFull) {
    this.competitionHandler.updateTest(test._links.self, test).subscribe(
      (res) => test = res,
      (err) => console.log(err)
    );
  }

  deleteTest(test: TestFull) {
    this.competitionHandler.deleteTest(test._links.self).subscribe(
      (res) => {
        console.log(res);
        const i = this.tests.findIndex(t => t._links.self === test._links.self);
        this.tests.splice(i, 1);
      },
      (err) => console.log(err)
    )
  }

}
