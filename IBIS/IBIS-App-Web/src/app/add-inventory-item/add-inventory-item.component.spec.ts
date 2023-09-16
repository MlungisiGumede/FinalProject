
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInventoryItemComponent } from './add-inventory-item.component';

describe('AddInventoryItemComponent', () => {
  let component: AddInventoryItemComponent;
  let fixture: ComponentFixture<AddInventoryItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInventoryItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddInventoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
