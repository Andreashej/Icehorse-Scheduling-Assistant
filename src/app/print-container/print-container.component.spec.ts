import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintContainerComponent } from './print-container.component';

describe('PrintContainerComponent', () => {
  let component: PrintContainerComponent;
  let fixture: ComponentFixture<PrintContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
