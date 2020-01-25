import { Component, OnInit, Input, EventEmitter, Output, ViewChild, AfterViewInit } from '@angular/core';
import { CompetitionImporterService } from '../competition-importer.service';
import { GlobalUpdateService } from '../global-update.service';
import { Test } from '../models/test.model';
import { Draggable, DropEventArgs, DragEventArgs } from '@syncfusion/ej2-base';

@Component({
  selector: 'app-test-card',
  templateUrl: './test-card.component.html',
  styleUrls: ['./test-card.component.css']
})
export class TestCardComponent implements OnInit, AfterViewInit {
  @Input() test: Test;
  @Output() _toggleFinal = new EventEmitter();
  @Output() testDropped = new EventEmitter();
  @Output() testDragStart = new EventEmitter();
  hours = 0;
  minutes = 0;
  free_left = 0;
  free_right = 0;


  @ViewChild('testElt') testElement: any;

  constructor(private competitionImporter: CompetitionImporterService, private updateService: GlobalUpdateService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    let draggable: Draggable = new Draggable(this.testElement.nativeElement, 
      {
        clone: false,
        dragStop: (e: DropEventArgs) => {
          this.testDropped.emit({event: e, data: this.test});
        },
        dragStart: (e: DragEventArgs) => {
          this.testDragStart.emit({event: e, data: this.test});
        }
      }
    );
  }

  toggleFinal(phase: string) {
    // this.competitionImporter.toggleFinal(this.test._id, phase).subscribe(
    //   update => this.test = update,
    //   () => console.log('Error on final toggle'),
    //   () => {
    //     this.updateService.updateUnassigned();
    //   }
    // );
  }

}
