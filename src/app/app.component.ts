import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'Icehorse Scheduling Assistant';
  // activeCompetition = null

  // constructor(private auth: AuthService) {}

  ngOnInit() {
    // this.activeCompetition = localStorage.getItem('currentCompetition') ? localStorage.getItem('currentCompetition') : null;
  }
}