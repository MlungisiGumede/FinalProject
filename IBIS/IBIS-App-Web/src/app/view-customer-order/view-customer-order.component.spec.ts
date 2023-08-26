import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCustomerOrderComponent } from './view-customer-order.component';

describe('ViewCustomerOrderComponent', () => {
  let component: ViewCustomerOrderComponent;
  let fixture: ComponentFixture<ViewCustomerOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCustomerOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCustomerOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
