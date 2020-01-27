import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Alert } from '../models/alert.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  alert = new Alert('', '');

  constructor(private router: Router,
              private authService: AuthService) { }

  ngOnInit() {
  }

  login(username, password) {
    if (username && password) {
      this.authService.login(username, password)
        .subscribe(
          (res) => {
            console.log(res);
            window.location.replace('/');
          },
          (err) => {
            console.log(err);
            this.alert = new Alert(err.message, 'danger');
          }
        )
    }
  }

}
