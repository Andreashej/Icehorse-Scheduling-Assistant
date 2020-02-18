import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { TestFull } from '../models/test-full.model';
import { CompetitionHandlerService } from '../competition.handler.service';
import { TestBlock } from '../models/testblock.model';

@Component({
  selector: 'app-schedule-block-list',
  templateUrl: './schedule-block-list.component.html',
  styleUrls: ['./schedule-block-list.component.css']
})
export class ScheduleBlockListComponent implements OnInit {
  tests: TestFull[] = [];

  @Input() data;
  @Output() created = new EventEmitter;

  competitionUri: string;

  constructor(private competitionHandler: CompetitionHandlerService) { }

  ngOnInit() {
    this.competitionUri = localStorage.getItem("currentCompetition");

    this.competitionHandler.getUnscheduledTests(this.competitionUri).subscribe(
      tests => {this.tests = tests; console.log(this.tests)},
      err => console.log(err)
    );
  }

  createTestBlock(test, phase) {
    let params = null;

    if (phase !== 'CUSTOM') {
      params = {
        test_id: test.test_id,
        phase: phase,
        starttime: this.data.starttime,
        venue_id: 1,
        groups: test.unscheduled_groups,
      }
    } else {
      params = {
        phase: phase,
        starttime: this.data.starttime,
        venue_id: 1,
        groups: 1,
        grouptime: test.duration,
        label: test.label,
        test_id: null
      }
    }

    this.competitionHandler.createScheduleBlock(`${this.competitionUri}/schedule`, params).subscribe(
        testblock => {
          console.log(testblock);
          this.created.emit(testblock)
        }
    )
  }

}
