import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderHelpComponent } from './calender-help.component';

describe('CalenderHelpComponent', () => {
  let component: CalenderHelpComponent;
  let fixture: ComponentFixture<CalenderHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalenderHelpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalenderHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
