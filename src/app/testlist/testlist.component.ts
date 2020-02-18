import { Component, OnInit, Input } from '@angular/core';
import { CompetitionHandlerService } from '../competition.handler.service';
import { Test } from '../models/test.model';
import { TestFull } from '../models/test-full.model';

@Component({
  selector: 'app-testlist',
  templateUrl: './testlist.component.html',
  styleUrls: ['./testlist.component.css']
})
export class TestlistComponent implements OnInit {
  tests: Test[];

  constructor(private competitionHandler: CompetitionHandlerService) { }

  ngOnInit() {
    const uri = localStorage.getItem('currentCompetition');
    if( uri ) {
      this.competitionHandler.getTests(uri).subscribe(
        tests => {
          this.tests = tests;
        }
      );
    }
  }

  toggleFinal(test: TestFull, final: string) {
    switch(final) {
      case 'AFIN':
        test.allowAFIN = !test.allowAFIN;
        break;
      case 'BFIN':
        test.allowBFIN = !test.allowBFIN;
        break;
    }

    this.competitionHandler.updateTest(test._links.self, test).subscribe(
      testNew => test = testNew
    )
  }
}
