import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningView } from './learning-view';

describe('LearningView', () => {
  let component: LearningView;
  let fixture: ComponentFixture<LearningView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
