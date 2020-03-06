import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JudgeEditorComponent } from './judge-editor/judge-editor.component';
import { ScheduleContainerComponent } from './schedule-container/schedule-container.component';
import { PrintHandlerComponent } from './print-handler/print-handler.component';
import { SettingsComponent } from './settings/settings.component';
import { LoginComponent } from './login/login.component';
import { TestSetupComponent } from './test-setup/test-setup.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  // {path: 'judges', component: JudgeEditorComponent},
  {path: '', component: ScheduleContainerComponent, data: { name: "Schedule", hideControls: false }},
  {path: 'print', component: PrintHandlerComponent, data: { name: "Print", hideControls: false }},
  {path: 'settings', component: SettingsComponent, data: { name: "Settings", hideControls: false }},
  {path: 'tests', component: TestSetupComponent, data: { name: "Tests", hideControls: false }},
  {path: 'login', component: LoginComponent, data: { name: "Login", hideControls: true }},
  {path: 'register', component: RegisterComponent, data: { name: "Register", hideControls: true }},
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes)]
})
export class AppRoutingModule { }
