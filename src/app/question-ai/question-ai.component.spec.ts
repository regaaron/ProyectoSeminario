import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionAIComponent } from './question-ai.component';

describe('QuestionAIComponent', () => {
  let component: QuestionAIComponent;
  let fixture: ComponentFixture<QuestionAIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionAIComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestionAIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
