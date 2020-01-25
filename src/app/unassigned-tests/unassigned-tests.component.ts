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
  styleUrls: ['./unassigned-tests.component.css']
})
export class UnassignedTestsComponent implements OnInit {

  @Output() testDropped = new EventEmitter();
  @Output() testDragStart = new EventEmitter();
  @Input() tests: Test[];

  constructor() { }

  ngOnInit() {
    
  }

  testDrop(e) {
    this.testDropped.emit(e);
  }

  onDrag(e) {
    this.testDragStart.emit(e);
  }

  // reloadTestData(): void {
  //   this.loading = true;
  //   this.competitionImporter.refreshTestData().subscribe(
  //     data => {
  //       this.testdata = data;
  //     },
  //     () => {
  //       console.log('Error when reloading');
  //       this.loading = false;
  //     },
  //     () => {
  //       this.loading = false;
  //       this.updateService.doUpdate('');
  //     }
  //   );
  // }

  // createCustomTest(name, duration): void {
  //   this.competitionImporter.create_custom(name, duration).subscribe(
  //     () => console.log('Saved'),
  //     () => console.log('Error when creating new'),
  //     () => this.updateService.updateUnassigned()
  //   );
  // }

}
