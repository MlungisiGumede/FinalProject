import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerHelpComponent } from './customer-help.component';

describe('CustomerHelpComponent', () => {
  let component: CustomerHelpComponent;
  let fixture: ComponentFixture<CustomerHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerHelpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
