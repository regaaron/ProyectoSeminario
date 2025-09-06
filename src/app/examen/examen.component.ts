import { Component } from '@angular/core';
import { ExamenService } from '../services/examen.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-examen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './examen.component.html',
  styleUrl: './examen.component.css'
})
export class ExamenComponent {

  examen: any[] = [];
  examenId = 1; // ID of the exam to display
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

}
