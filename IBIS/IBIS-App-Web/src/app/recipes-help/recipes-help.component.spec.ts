import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipesHelpComponent } from './recipes-help.component';

describe('RecipesHelpComponent', () => {
  let component: RecipesHelpComponent;
  let fixture: ComponentFixture<RecipesHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipesHelpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipesHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
