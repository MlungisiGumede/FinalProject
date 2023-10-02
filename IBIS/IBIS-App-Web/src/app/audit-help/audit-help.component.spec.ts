import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditHelpComponent } from './audit-help.component';

describe('AuditHelpComponent', () => {
  let component: AuditHelpComponent;
  let fixture: ComponentFixture<AuditHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditHelpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
