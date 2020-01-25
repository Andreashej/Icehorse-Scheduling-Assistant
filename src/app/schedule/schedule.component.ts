import { Component, OnInit } from '@angular/core';
import { CompetitionHandlerService } from '../competition.handler.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  settings;
  hours: number[];

  constructor(private settingsProvider: CompetitionHandlerService) { }

  ngOnInit() {
    this.getSettings();
  }

  initDays(): void {
  }

  getSettings(): void {
    this.settingsProvider.getSettings().subscribe(
      data => this.settings = data,
      error => console.log('Error when fetching data'),
      () => this.initDays()
    );
  }

}
