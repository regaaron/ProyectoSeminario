import { Component } from '@angular/core';
import { ExamenService } from '../services/examen.service';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-examen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './examen.component.html',
  styleUrl: './examen.component.css',
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('600ms cubic-bezier(0.68, -0.65, 0.27, 1.55)', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('0ms ease-in', style({ opacity: 0, transform: 'translateX(-20px)' }))
      ])
    ])
  ]
})
export class ExamenComponent {

  examen: any[] = [];
  examenId = 1;// ID of the exam to display
  currentQuestionIndex = 0; // Tracks the current question
  answeredQuestionsCount = 0; // Tracks how many questions have been answered
  userAnswers: { [key: number]: number } = {}; // Stores user's selected answers {preguntaId: respuestaId}

  constructor(private examenService: ExamenService) { }

  ngOnInit(): void{
    this.obetenerExamen();
  }

  obetenerExamen(): void{
    this.examenService.getExamenes(this.examenId).subscribe(data =>{
      this.examen = data;
      console.log(this.examen);
    });
  }

  // Method to handle a user's answer selection
  seleccionarRespuesta(preguntaId: number, respuestaId: number): void {
    // If the question hasn't been answered before, increment the counter
    if (!this.userAnswers[preguntaId]) {
      this.answeredQuestionsCount++;
    }
    // Store the selected answer
    this.userAnswers[preguntaId] = respuestaId;
  }

  // Method to navigate to the next question
  siguientePregunta(): void {
    if (this.currentQuestionIndex < this.examen.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  // Method to navigate to the previous question
  preguntaAnterior(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  // Method to check if a question has been answered
  isPreguntaRespondida(preguntaId: number): boolean {
    return !!this.userAnswers[preguntaId];
  }
  
  // Method to check if a specific answer is selected
  isRespuestaSeleccionada(preguntaId: number, respuestaId: number): boolean {
    return this.userAnswers[preguntaId] === respuestaId;
  }

  trackByPregunta(index: number, item: any) {
    return item.id_pregunta; // o cualquier id único de la pregunta
  }

}
