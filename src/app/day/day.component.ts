import { Component, OnInit, Input, Output, OnChanges, OnDestroy, DoCheck } from '@angular/core';
import { NgDragDropModule } from 'ng-drag-drop';
import { CompetitionHandlerService } from '../competition.handler.service';
import { CompetitionImporterService } from '../competition-importer.service';
import { EventEmitter } from 'events';
import { GlobalUpdateService } from '../global-update.service';
import { Subscription } from 'rxjs';
import { Competition } from '../models/competition.model';
import { Test } from '../models/test.model';
import { Venue } from '../models/venue.model';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit {
  @Input() date;
  @Input() printTemplate;
  @Input() competition: Competition;
  @Input() tests: Test[];

  scheduledTests = [];
  settings = {
    'days': [],
    'hours': 0,
    'name': ''
  };
  hours = [];
  blocks = {};
  saved;
  updates = false;
  subscription: Subscription;
  trackChangeSubscription: Subscription;
  allBlocks: Block[] = [];

  busyUntil = {};

  // onDropTest(test: any, elt) {
  //   const blockSize = Math.ceil((test.dragData.prel_time - 0.9) / 5);
  //   this.saveTest(
  //     test.dragData.testcode,
  //     test.dragData.phase,
  //     test.dragData.section,
  //     new Date(this.date),
  //     this.blocks.indexOf(elt),
  //     elt.blocktime.getTime(),
  //     new Date(elt.blocktime.getTime() + test.dragData.prel_time * 60000).getTime());

  //   elt.rowspan = blockSize;
  //   elt.testcode = test.dragData.testcode;
  //   elt.content = test.dragData;
  //   elt.content.state = new Date(this.date);
  //   elt.droppable = false;
  // }

  constructor(private competitionHandler: CompetitionHandlerService) { }

  ngOnInit() {
    // this.date = new Date(this.date);
    // this.getSettings();

    this.initDays();
  }

  // ngOnDestroy() {
  //   // this.subscription.unsubscribe();
  //   // this.trackChangeSubscription.unsubscribe();
  // }

  // removeUnassigned(e: any, test) {
  //   this.scheduledTests.splice(this.scheduledTests.indexOf(test), 1);
  // }

  initDays(): void {
    this.initSchedule(this.tests);

    let blocktime = this.date;
    blocktime.setHours(7);
    for (const venue of this.competition.venues) {
      this.blocks[venue.uri] = [];
      this.busyUntil[venue.uri] = -1;
    }

    
    for (let i = 0; i <= 14 * 13; i++) {
      // const block = {
        //   'blocktime': blocktime,
        //   'rowspan': 1,
        //   'testcode': '',
        //   'content': undefined,
        //   'droppable': true
        // };
        
        let block = new Block(i, blocktime);

        this.allBlocks.push(block);
        
      for (const venue of this.competition.venues) {
        let vBlock = new Block();
        vBlock.blockId = block.blockId;
        vBlock.blocktime = block.blocktime;
        vBlock.busyUntil = this.busyUntil[venue.uri];
        
        if (this.busyUntil[venue.uri] >= i) {
          this.blocks[venue.uri].push(vBlock);
          continue;
        }
        
        vBlock.setTest(this.tests.find(test => (test.blockIndex == i && test.venue.uri == venue.uri)));
        
        if (vBlock.test) {
          this.busyUntil[venue.uri] = i + vBlock.test.getBlockSpan();
        }
        
        this.blocks[venue.uri].push(vBlock);
      }
      blocktime = new Date(blocktime.getTime() + 5 * 60000);
    }
  }

  // getTestData(): void {
  //   this.scheduledTests = [];
  //   // const trackstate = this.competitionImporter.activeTrack;
  //   this.competitionHandler.getTests(this.competition.uri).subscribe(
  //     data => this.scheduledTests = data,
  //     () => console.log('Error when fetching data'),
  //     () => {
  //       console.log(this.scheduledTests);
  //       // this.initSchedule(this.scheduledTests);
  //     }
  //   );
  // }

  initSchedule(tests: Test[]) {
    if (tests.length > 0) {
      for (const test of tests) {
        if(test.starttime.getDate() == this.date.getDate()) {
          test.blockIndex = this.getStartBlock(test);
        }
      }
    }
  }

  getStartBlock(test: Test) {
    this.date.setHours(7);
    return ((test.starttime.getTime() - this.date.getTime()) / 60000) / 5;
  }

  findTestByBlockId(bid, vid) {
    return this.tests.find(test => (test.blockIndex === bid && test.venue.uri === vid));
  }

  findBlockById(bid, vid) {
    const block = this.blocks[vid].find(block => block.blockId === bid);
    return block;
  }

  // isVenueBusy(venue, blockIndex, test) {
  //   let canSkip;

  //   if(blockIndex < this.busyUntil[venue.uri]) {
  //     canSkip = true;
  //   } else {

  //     if (test) {
  //       this.busyUntil[venue.uri] = blockIndex
  //     }
  //     canSkip = false;
  //   }
  //   console.log(this.busyUntil);

  //   return canSkip

  // }

  // getSettings(): void {
  //   this.settingsProvider.getSettings().subscribe(
  //     data => this.settings = data,
  //     error => console.log('Error when fetching data'),
  //     () => {
  //       this.subscription = this.updateService.dayUpdate.subscribe(
  //         next => {
  //           if (next === this.date.getDate() + '&' + this.date.getMonth() + '&' + this.date.getYear() || next === '') {
  //             this.blocks = [];
  //             this.initDays();
  //           }
  //         });
  //         this.trackChangeSubscription = this.competitionImporter.trackChange.subscribe(
  //           () => {
  //             this.blocks = [];
  //             this.initDays();
  //           }
  //         );
  //     }
  //   );
  // }

  // saveTest(test, phase, section_id, state, startBlock, start, end): void {
  //   this.competitionImporter.saveTestState(
  //     test, phase, section_id, state.getTime(), startBlock, start, end).subscribe(
  //       () => console.log('Saving...'),
  //       error => console.log('Error when fetching data ' + error),
  //       () => console.log('Successfully saved test state')
  //     );
  // }

  // allowDrop(block): void {
  //   block.droppable = true;
  //   block.rowspan = 1;
  // }

  // remove(block) {
  //   block.testcode = '';
  //   block.content = undefined;
  //   block.droppable = true;
  // }
}

class Block {
  blockId: number;
  blocktime: Date;
  test: Test;
  busyUntil: number;

  constructor(bid?, bt?, busy?) {
    this.blockId = bid;
    this.blocktime = bt;
    this.busyUntil = busy;
  }

  setTest(test: Test) {
    this.test = test;
  }
}
