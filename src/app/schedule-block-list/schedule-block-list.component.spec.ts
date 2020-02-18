import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleBlockListComponent } from './schedule-block-list.component';

describe('ScheduleBlockListComponent', () => {
  let component: ScheduleBlockListComponent;
  let fixture: ComponentFixture<ScheduleBlockListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleBlockListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleBlockListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
