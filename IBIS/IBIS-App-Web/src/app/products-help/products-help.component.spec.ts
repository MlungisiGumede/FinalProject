import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsHelpComponent } from './products-help.component';

describe('ProductsHelpComponent', () => {
  let component: ProductsHelpComponent;
  let fixture: ComponentFixture<ProductsHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsHelpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
