import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompetitionHandlerService } from '../competition.handler.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { Competition } from '../models/competition.model';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit {
  @Input() isLoggedIn: boolean;

  menuItems: Array<any> = [
    {
      name: "Schedule",
      icon: "calendar",
      link: "/",
      options: {exact: true}
    },
    {
      name: "Print",
      icon: "print",
      link: "/print",
      options: {exact: false}
    },
    {
      name: "Test setup",
      icon: "list",
      link: "/tests",
      options: {exact: false}
    },
    {
      name: "Setup",
      icon: "cog",
      link: "/settings",
      options: {exact: false}
    }
  ]

  constructor(
    public auth: AuthService,
  ) { }

  ngOnInit() {
    setTimeout(
      () => {
        this.isLoggedIn = this.auth.isLoggedIn()
      }, 0);
  }

  logout() {
    this.isLoggedIn = false;
    this.auth.logout();
  }
}
