import { Component, OnInit, Input } from '@angular/core';
import { TestBlock } from '../models/testblock.model';

@Component({
  selector: 'app-test-card',
  templateUrl: './test-card.component.html',
  styleUrls: ['./test-card.component.css']
})
export class TestCardComponent implements OnInit {
  @Input() test: TestBlock;


  ngOnInit() {
    
  }
}
