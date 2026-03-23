import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLearningComponent } from './admin-learning';

describe('AdminLearning', () => {
 let component: AdminLearningComponent;
  let fixture: ComponentFixture<AdminLearningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLearningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLearningComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
