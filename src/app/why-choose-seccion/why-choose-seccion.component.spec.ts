import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyChooseSeccionComponent } from './why-choose-seccion.component';

describe('WhyChooseSeccionComponent', () => {
  let component: WhyChooseSeccionComponent;
  let fixture: ComponentFixture<WhyChooseSeccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyChooseSeccionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WhyChooseSeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
