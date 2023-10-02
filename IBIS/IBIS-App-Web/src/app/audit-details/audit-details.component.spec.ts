import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditDetailsComponent } from './audit-details.component';

describe('AuditDetailsComponent', () => {
  let component: AuditDetailsComponent;
  let fixture: ComponentFixture<AuditDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
