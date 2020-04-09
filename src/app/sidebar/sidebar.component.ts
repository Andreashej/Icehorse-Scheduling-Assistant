import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() header: string;
  @Input() headerButtons: any;
  @Input() visible: boolean;

  @Output() buttonClicked = new EventEmitter();
  @Output() sidebarHidden = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  buttonClick(event) {
    this.buttonClicked.emit(event);
  }

  hideSidebar() {
    this.sidebarHidden.emit();
  }

}
