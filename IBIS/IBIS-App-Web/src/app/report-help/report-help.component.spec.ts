import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportHelpComponent } from './report-help.component';

describe('ReportHelpComponent', () => {
  let component: ReportHelpComponent;
  let fixture: ComponentFixture<ReportHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportHelpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
