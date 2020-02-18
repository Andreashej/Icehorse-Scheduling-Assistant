import { Component, OnInit, Input } from '@angular/core';
import { Test } from '../models/test.model';

@Component({
  selector: 'app-test-card',
  templateUrl: './test-card.component.html',
  styleUrls: ['./test-card.component.css']
})
export class TestCardComponent implements OnInit {
  @Input() test: Test;


  ngOnInit() {
    
  }
}
