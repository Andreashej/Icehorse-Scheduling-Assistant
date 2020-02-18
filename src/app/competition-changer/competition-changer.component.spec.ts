import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionChangerComponent } from './competition-changer.component';

describe('CompetitionChangerComponent', () => {
  let component: CompetitionChangerComponent;
  let fixture: ComponentFixture<CompetitionChangerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetitionChangerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitionChangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
