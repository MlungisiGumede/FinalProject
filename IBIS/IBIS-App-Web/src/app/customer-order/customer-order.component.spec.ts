import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerOrderComponent } from './customer-order.component';

describe('CustomerOrderComponent', () => {
  let component: CustomerOrderComponent;
  let fixture: ComponentFixture<CustomerOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
