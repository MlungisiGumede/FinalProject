import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderFromSupplierComponent } from './order-from-supplier.component';

describe('OrderFromSupplierComponent', () => {
  let component: OrderFromSupplierComponent;
  let fixture: ComponentFixture<OrderFromSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderFromSupplierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderFromSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
