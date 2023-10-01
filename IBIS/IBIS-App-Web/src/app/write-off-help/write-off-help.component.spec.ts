import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteOffHelpComponent } from './write-off-help.component';

describe('WriteOffHelpComponent', () => {
  let component: WriteOffHelpComponent;
  let fixture: ComponentFixture<WriteOffHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WriteOffHelpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WriteOffHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
