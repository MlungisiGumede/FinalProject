import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpFunctionComponent } from './help-function.component';

describe('HelpFunctionComponent', () => {
  let component: HelpFunctionComponent;
  let fixture: ComponentFixture<HelpFunctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpFunctionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
