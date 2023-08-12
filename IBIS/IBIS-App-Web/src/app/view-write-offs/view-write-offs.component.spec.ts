import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWriteOffsComponent } from './view-write-offs.component';

describe('ViewWriteOffsComponent', () => {
  let component: ViewWriteOffsComponent;
  let fixture: ComponentFixture<ViewWriteOffsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewWriteOffsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewWriteOffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
