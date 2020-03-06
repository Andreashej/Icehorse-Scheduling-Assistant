import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormControl, Validators, ValidatorFn, ValidationErrors, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  userForm;

  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      username: new FormControl('', [ Validators.required]),
      email: new FormControl('', [ Validators.required]),
      password: new FormControl('', [ Validators.required]),
      confirm: new FormControl('', [ Validators.required])
    }, {validators: [passwordsNotEqualValidator]});
  }

  onSubmit(userData) {
    this.auth.createUser(userData.username, userData.password, userData.email).subscribe(
      user => {
        this.auth.login(user.username, userData.password).subscribe(
          res => window.location.replace('/')
        );
      }
    )
  }

}

const passwordsNotEqualValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('password');
  const confirm = control.get('confirm');

  const isValid = password.value !== '' && confirm.value !== '' && password.value !== confirm.value
  
  return  isValid ? { 'passwordsNotEqual' : true } : null;
}