import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierHelpComponent } from './supplier-help.component';

describe('SupplierHelpComponent', () => {
  let component: SupplierHelpComponent;
  let fixture: ComponentFixture<SupplierHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierHelpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
