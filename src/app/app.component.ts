import { Component, OnInit } from '@angular/core';
import { GlobalUpdateService } from './global-update.service';
import { Router, ActivationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'Icehorse Competition Assistant';

  public header: string;

  public hideMenu = false;

  constructor(public updater: GlobalUpdateService, private router: Router) {
    this.router.events.pipe(filter(event => event instanceof ActivationEnd)).subscribe(
      (route: ActivatedRoute) => {
        this.hideMenu = route.snapshot.data.hideControls;
      }
    );
  }

  ngOnInit() {
  }

  updateTitle(name) {
    this.header = name;
  }
}