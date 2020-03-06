import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgDragDropModule } from 'ng-drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { UnassignedTestsComponent } from './unassigned-tests/unassigned-tests.component';

import { CompetitionImporterService } from './competition-importer.service';
import { CompetitionHandlerService } from './competition.handler.service';

import { TestCardComponent } from './test-card/test-card.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { DayComponent } from './day/day.component';

import { TestCardScheduleComponent } from './test-card-schedule/test-card-schedule.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GlobalUpdateService } from './global-update.service';
import { AppRoutingModule } from './app-routing.module';
import { JudgeEditorComponent } from './judge-editor/judge-editor.component';
import { ScheduleContainerComponent } from './schedule-container/schedule-container.component';
import { PrintHandlerComponent } from './print-handler/print-handler.component';
import { SettingsComponent } from './settings/settings.component';
import { LoginComponent } from './login/login.component';
import { AuthInterceptor } from './auth-interceptor';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { PrintContainerComponent } from './print-container/print-container.component';
import { TestlistComponent } from './testlist/testlist.component';
import { ScheduleBlockListComponent } from './schedule-block-list/schedule-block-list.component';
import { MenubarComponent } from './menubar/menubar.component';
import { TestSetupComponent } from './test-setup/test-setup.component';
import { PageContainerComponent } from './page-container/page-container.component';
import { CompetitionChangerComponent } from './competition-changer/competition-changer.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UnassignedTestsComponent,
    TestCardComponent,
    ScheduleComponent,
    DayComponent,
    TestCardScheduleComponent,
    JudgeEditorComponent,
    ScheduleContainerComponent,
    PrintHandlerComponent,
    SettingsComponent,
    LoginComponent,
    TestlistComponent,
    ScheduleBlockListComponent,
    MenubarComponent,
    TestSetupComponent,
    PageContainerComponent,
    CompetitionChangerComponent,
    PrintContainerComponent,
    UserEditComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgDragDropModule.forRoot(),
    BrowserModule,
    FormsModule,
    NgbModule,
    AppRoutingModule,
    ScheduleModule,
    TreeViewModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
  ],
  providers: [
    CompetitionImporterService,
    CompetitionHandlerService,
    GlobalUpdateService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
