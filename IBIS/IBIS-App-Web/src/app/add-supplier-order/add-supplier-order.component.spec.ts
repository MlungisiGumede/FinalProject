import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSupplierOrderComponent } from './add-supplier-order.component';

describe('AddSupplierOrderComponent', () => {
  let component: AddSupplierOrderComponent;
  let fixture: ComponentFixture<AddSupplierOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSupplierOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSupplierOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
