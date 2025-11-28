import { Component } from '@angular/core';
import { ExamenService } from '../services/examen.service';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

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
  // Feedback y resultados
  showFeedback = false;
  feedbackCorrecta = false;
  feedbackRespuestaCorrectaTexto = '';
  isFinalizado = false;
  resultadoCorrectas = 0;
  resultadoPuntaje = 0;
  isCargando = false;
  // Contexto del examen actual
  private temaActual: string | null = null;
  private subActual: string | null = null;
  iaActual: boolean | null = null;
  private readonly maxPreguntas = 10;

  constructor(private examenService: ExamenService, private route: ActivatedRoute) { }

  ngOnInit(): void{
    // Leer parámetros de ruta: tema (requerido) y sub (opcional)
    this.route.paramMap.subscribe(paramMap => {
      const temaParam = paramMap.get('tema') || '';
      const subParam = paramMap.get('sub') || '';

      const tema = temaParam ? decodeURIComponent(temaParam) : '';
      const sub = subParam ? decodeURIComponent(subParam) : '';

      // Leer query param 'ia' una vez (si cambia, se podría suscribir también a queryParamMap)
      const iaParam = this.route.snapshot.queryParamMap.get('ia');
      this.iaActual = iaParam != null ? Number(iaParam) === 1 : null;

      if(tema){
        this.temaActual = tema;
        this.subActual = sub || null;
        this.obtenerExamenPorTemaSub(tema, sub);
      } else {
        // Fallback: cargar examen por id si no hay tema
        this.obetenerExamenPorId();
      }
    });
  }

  obetenerExamenPorId(): void{
    this.isCargando = true;
    this.examenService.getExamenes(this.examenId)
      .pipe(finalize(() => this.isCargando = false))
      .subscribe({
        next: (data) => {
          this.examen = this.prepareExamen(data || []);
          console.log(this.examen);
          this.resetState();
        },
        error: (err) => {
          console.error('Error cargando examen por id', err);
        }
      });
  }

  obtenerExamenPorTemaSub(tema: string, sub?: string): void{
    this.isCargando = true;
    this.examenService.getExamenPorTemaSub(tema, sub, this.maxPreguntas, this.iaActual ?? undefined)
      .pipe(finalize(() => this.isCargando = false))
      .subscribe({
        next: (data) => {
          this.examen = this.prepareExamen(data || []);
          console.log('Examen cargado para', tema, sub, this.examen);
          this.resetState();
        },
        error: (err) => {
          console.error('Error cargando examen por tema/sub', err);
        }
      });
  }

  // Fisher-Yates shuffle
  private shuffleArray<T>(array: T[]): T[] {
    const a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  private prepareExamen(data: any[]): any[] {
    // No repetir preguntas: deduplicar por id_pregunta o por enunciado normalizado
    const unicas = this.dedupePreguntas(data);
    const preguntas = this.shuffleArray(unicas).slice(0, this.maxPreguntas);
    preguntas.forEach(q => { if (q?.respuestas) q.respuestas = this.shuffleArray(q.respuestas); });
    return preguntas;
  }

  private dedupePreguntas(arr: any[]): any[] {
    const seenById = new Set<number | string>();
    const seenByText = new Set<string>();
    const norm = (s: any) => String(s ?? '')
      .normalize('NFKC')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    const out: any[] = [];
    for (const q of arr || []) {
      const id = q?.id_pregunta;
      const textKey = norm(q?.pregunta_enunciado);
      if (id != null) {
        if (seenById.has(id)) continue;
        seenById.add(id);
      } else {
        if (seenByText.has(textKey)) continue;
        seenByText.add(textKey);
      }
      out.push(q);
    }
    return out;
  }

  // Determinar si una respuesta es correcta (heurística según esquema posible)
  esRespuestaCorrecta(pregunta: any, respuesta: any): boolean {
    if (!respuesta && !pregunta) return false;
    // Caso principal: campo es_correcta (0/1 o '0'/'1')
    if (respuesta && (respuesta.es_correcta !== undefined && respuesta.es_correcta !== null)) {
      return Number(respuesta.es_correcta) === 1;
    }
    if (respuesta && (respuesta.correcta !== undefined)) return !!respuesta.correcta;
    if (respuesta && (respuesta.isCorrect !== undefined)) return !!respuesta.isCorrect;
    // Por id en la pregunta
    const correctId = pregunta?.id_respuesta_correcta ?? pregunta?.respuesta_correcta_id ?? pregunta?.correctAnswerId;
    if (correctId !== undefined && respuesta) {
      return Number(correctId) === Number(respuesta.id_respuesta);
    }
    return false;
  }

  // Método actualizado para seleccionar respuesta con feedback y auto avance
  seleccionarRespuesta(preguntaId: number, respuestaId: number, pregunta?: any, respuesta?: any): void {
    const primeraVez = !this.userAnswers[preguntaId];
    this.userAnswers[preguntaId] = respuestaId;
    if (primeraVez) this.answeredQuestionsCount++;

    // Calcular feedback
    let p = pregunta;
    let r = respuesta;
    if (!p) {
      p = this.examen[this.currentQuestionIndex];
    }
    if (!r && p && p.respuestas) {
      r = p.respuestas.find((x: any) => Number(x.id_respuesta) === Number(respuestaId));
    }
    this.feedbackCorrecta = this.esRespuestaCorrecta(p, r);
    this.showFeedback = true;
    if (!this.feedbackCorrecta) {
      const correcta = (p?.respuestas || []).find((x: any) => Number(x?.es_correcta) === 1);
      this.feedbackRespuestaCorrectaTexto = correcta?.respuesta_texto || '';
    } else {
      this.feedbackRespuestaCorrectaTexto = '';
    }

    // Auto avance si no es la última
    if (!this.isLastQuestion()) {
      setTimeout(() => this.siguientePregunta(), 900);
    }
  }

  isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.examen.length - 1;
  }

  onNext(): void {
    if (!this.isPreguntaRespondida(this.examen[this.currentQuestionIndex]?.id_pregunta)) return;
    if (this.isLastQuestion()) {
      this.finalizarExamen();
    } else {
      this.siguientePregunta();
    }
  }

  

  // Method to navigate to the next question
  siguientePregunta(): void {
    // Avanzar sólo si la actual está respondida
    const current = this.examen[this.currentQuestionIndex];
    if (!current || !this.isPreguntaRespondida(current.id_pregunta)) return;
    if (this.currentQuestionIndex < this.examen.length - 1) {
      this.currentQuestionIndex++;
      this.showFeedback = false;
      this.feedbackRespuestaCorrectaTexto = '';
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

finalizarExamen(): void {
  let correctas = 0;
  
  for (const q of this.examen) {
    const rid = this.userAnswers[q.id_pregunta];
    if (rid == null) continue;
    
    // Buscar la respuesta seleccionada - MEJORADO
    const resp = (q.respuestas || []).find((r: any) => {
      // Intentar diferentes formas de comparación
      return Number(r.id_respuesta) === Number(rid) || 
             r.id_respuesta === rid ||
             String(r.id_respuesta) === String(rid);
    });
    
    if (resp && this.esRespuestaCorrecta(q, resp)) {
      correctas++;
    }
  }
  
  console.log('Examen finalizado. Correctas:', correctas, 'de', this.examen.length);
  this.resultadoCorrectas = correctas;
  this.resultadoPuntaje = this.examen.length > 0 ? Math.round((correctas * 100) / this.examen.length) : 0;
  this.isFinalizado = true;
}

  regenerarExamen(): void {
    this.isFinalizado = false;
    this.resetState();
    if (this.temaActual) {
      this.obtenerExamenPorTemaSub(this.temaActual, this.subActual ?? undefined);
    } else {
      this.obetenerExamenPorId();
    }
  }

  private resetState(): void {
    this.currentQuestionIndex = 0;
    this.answeredQuestionsCount = 0;
    this.userAnswers = {};
    this.showFeedback = false;
    this.feedbackCorrecta = false;
    this.feedbackRespuestaCorrectaTexto = '';
  }

}
