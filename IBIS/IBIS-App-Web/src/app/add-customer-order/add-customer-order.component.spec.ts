import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerOrderComponent } from './add-customer-order.component';

describe('AddCustomerOrderComponent', () => {
  let component: AddCustomerOrderComponent;
  let fixture: ComponentFixture<AddCustomerOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCustomerOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCustomerOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
