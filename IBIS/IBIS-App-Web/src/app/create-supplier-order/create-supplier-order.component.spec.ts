import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSupplierOrderComponent } from './create-supplier-order.component';

describe('CreateSupplierOrderComponent', () => {
  let component: CreateSupplierOrderComponent;
  let fixture: ComponentFixture<CreateSupplierOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSupplierOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSupplierOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
