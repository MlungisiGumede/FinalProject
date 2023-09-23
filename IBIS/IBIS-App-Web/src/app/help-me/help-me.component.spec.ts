import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpMeComponent } from './help-me.component';

describe('HelpMeComponent', () => {
  let component: HelpMeComponent;
  let fixture: ComponentFixture<HelpMeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpMeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
