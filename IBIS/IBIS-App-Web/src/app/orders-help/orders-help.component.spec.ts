import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersHelpComponent } from './orders-help.component';

describe('OrdersHelpComponent', () => {
  let component: OrdersHelpComponent;
  let fixture: ComponentFixture<OrdersHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersHelpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
