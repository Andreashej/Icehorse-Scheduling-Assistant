import { Component, OnInit, Output, DoCheck, OnDestroy, EventEmitter, Input, ViewChild, AfterViewInit } from '@angular/core';
import { CompetitionImporterService } from '../competition-importer.service';
import { NgDragDropModule } from 'ng-drag-drop';
import { GlobalUpdateService } from '../global-update.service';
import { Test } from '../models/test.model';
import { CompetitionHandlerService } from '../competition.handler.service';
import { Competition } from '../models/competition.model';
import { Draggable, Droppable, DropEventArgs } from '@syncfusion/ej2-base';

@Component({
  selector: 'app-unassigned-tests',
  templateUrl: './unassigned-tests.component.html',
  styleUrls: ['./unassigned-tests.component.css'],
})

export class UnassignedTestsComponent implements OnInit {

  @Output() menuToggle = new EventEmitter();
  tests: Test[];

  menuState = 'show';

  constructor(private competitionHandler: CompetitionHandlerService) { }

  ngOnInit() {

  }

  toggleMenu() {
    this.menuState = this.menuState === 'show' ? 'hidden' : 'show';
    this.menuToggle.emit(this.menuState);
  }

}
