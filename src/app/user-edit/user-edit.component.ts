import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from '../auth.service';
import { FormBuilder, FormControl, Validators, ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  @Input() user: User;

  @Output() close = new EventEmitter;
  @Output() userUpdate = new EventEmitter;

  showPasswordForm = false;

  userForm;
  passwordForm;

  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder
  ) {

   }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      username: this.user.username,
      email: this.user.email
    });
    
    this.passwordForm = this.formBuilder.group({
      password: new FormControl('', [
        Validators.required,
      ]),
      confirm: new FormControl('', [
        Validators.required,
      ])
    }, { validators: [passwordsNotEqualValidator] });
  }

  onSubmit(userData) {
    this.auth.updateUser(this.user,userData).subscribe(
      user => {
        this.userUpdate.emit(user);
        this.modalDismiss();
      }
    )
  }

  changePassword(passwordData) {
    console.log(this.passwordForm.errors);
    if(!this.passwordForm.errors) {
      this.auth.updateUser(this.user, {
        password: passwordData.password
      }).subscribe(
        () => this.modalDismiss()
      );
    }
  }

  showPasswordFields() {
    this.showPasswordForm = true;
  }

  modalDismiss(e?) {
    this.close.emit(e);
  }

  
}

const passwordsNotEqualValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('password');
  const confirm = control.get('confirm');

  const isValid = password.value !== '' && confirm.value !== '' && password.value !== confirm.value
  
  return  isValid ? { 'passwordsNotEqual' : true } : null;
}