import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-daily-question',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daily-question.component.html',
  styleUrl: './daily-question.component.css',
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate(
          '600ms cubic-bezier(0.68, -0.65, 0.27, 1.55)',
          style({ opacity: 1, transform: 'translateX(0)' })
        )
      ]),
      transition(':leave', [
        animate(
          '0ms ease-in',
          style({ opacity: 0, transform: 'translateX(-20px)' })
        )
      ])
    ])
  ]
})
export class DailyQuestionComponent implements OnDestroy {

  examen: any[] = [];
  currentQuestionIndex = 0;
  answeredQuestionsCount = 0;
  userAnswers: { [key: number]: number } = {};

  showFeedback = false;
  feedbackCorrecta = false;
  feedbackRespuestaCorrectaTexto = '';
  isFinalizado = false;
  resultadoCorrectas = 0;
  resultadoPuntaje = 0;
  isCargando = false;
  bloqueada = false;
  countdownText = '';
  private countdownInterval: any;
  private uid!: string;

  // solo para daily: 1 pregunta
  private readonly maxPreguntas = 1;

    constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.uid = this.authService.currentUser?.uid!;
    this.verificarDisponibilidad();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

    verificarDisponibilidad(): void {
    this.isCargando = true;

    this.http.get(`http://localhost:3000/auth/daily/${this.uid}`)
      .subscribe({
        next: (res: any) => {
          this.isCargando = false;

          if (res.available) {
            // puede contestar → cargar pregunta
            this.obtenerPreguntaDiariaGenerica();
          } else {
            // bloqueada → mostrar mensaje + temporizador
            this.bloqueada = true;

            if (res.remainingMs) {
              this.iniciarCountdown(res.remainingMs);
            }
          }
        },
        error: (err) => {
          console.error('Error verificando daily', err);
          this.isCargando = false;
        }
      });
  }



  obtenerPreguntaDiariaGenerica(): void {
    this.isCargando = true;

    this.http.get('http://localhost:3000/examenes/daily')
      .subscribe({
        next: (data: any) => {
          console.log('Pregunta diaria desde back:', data);
          this.examen = [data];
          this.resetState();
          this.isCargando = false;
        },
        error: (err) => {
          console.error('Error cargando pregunta diaria', err);
          this.isCargando = false;
        }
      });
  }


    iniciarCountdown(remainingMs: number): void {
    const updateText = () => {
      if (remainingMs <= 0) {
        this.countdownText = 'Disponible ahora';
        this.bloqueada = false;
        if (this.countdownInterval) clearInterval(this.countdownInterval);
        // opcional: recargar disponibilidad
        this.verificarDisponibilidad();
        return;
      }

      const totalSeconds = Math.floor(remainingMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      this.countdownText =
        `${hours.toString().padStart(2, '0')}:` +
        `${minutes.toString().padStart(2, '0')}:` +
        `${seconds.toString().padStart(2, '0')}`;

      remainingMs -= 1000;
    };

    // primera actualización inmediata
    updateText();
    this.countdownInterval = setInterval(updateText, 1000);
  }


  // -------- utilidades ---------

  esRespuestaCorrecta(pregunta: any, respuesta: any): boolean {
    if (!respuesta && !pregunta) return false;
    if (
      respuesta &&
      (respuesta.es_correcta !== undefined && respuesta.es_correcta !== null)
    ) {
      return Number(respuesta.es_correcta) === 1;
    }
    return false;
  }

  seleccionarRespuesta(
    preguntaId: number,
    respuestaId: number,
    pregunta?: any,
    respuesta?: any
  ): void {
    const primeraVez = !this.userAnswers[preguntaId];
    this.userAnswers[preguntaId] = respuestaId;
    if (primeraVez) this.answeredQuestionsCount++;

    let p = pregunta;
    let r = respuesta;
    if (!p) {
      p = this.examen[this.currentQuestionIndex];
    }
    if (!r && p && p.respuestas) {
      r = p.respuestas.find(
        (x: any) => Number(x.id_respuesta) === Number(respuestaId)
      );
    }
    this.feedbackCorrecta = this.esRespuestaCorrecta(p, r);
    this.showFeedback = true;
    if (!this.feedbackCorrecta) {
      const correcta = (p?.respuestas || []).find(
        (x: any) => Number(x?.es_correcta) === 1
      );
      this.feedbackRespuestaCorrectaTexto =
        correcta?.respuesta_texto || '';
    } else {
      this.feedbackRespuestaCorrectaTexto = '';
    }

    // solo hay 1, al contestar terminamos
    setTimeout(() => this.finalizarExamen(), 900);
  }

  isPreguntaRespondida(preguntaId: number): boolean {
    return !!this.userAnswers[preguntaId];
  }

  isRespuestaSeleccionada(
    preguntaId: number,
    respuestaId: number
  ): boolean {
    return this.userAnswers[preguntaId] === respuestaId;
  }

  trackByPregunta(index: number, item: any) {
    return item.id_pregunta;
  }

    finalizarExamen(): void {
    let correctas = 0;
    for (const q of this.examen) {
      const rid = this.userAnswers[q.id_pregunta];
      if (rid == null) continue;
      const resp = (q.respuestas || []).find(
        (r: any) => Number(r.id_respuesta) === Number(rid)
      );
      if (this.esRespuestaCorrecta(q, resp)) correctas++;
    }
    this.resultadoCorrectas = correctas;
    this.resultadoPuntaje =
      this.examen.length > 0
        ? Math.round((correctas * 100) / this.examen.length)
        : 0;
    this.isFinalizado = true;

    // 👇 avisar al back que ya contestó la daily
    this.http.post('http://localhost:3000/auth/daily/complete', {
      uid: this.uid,
      preguntaId: this.examen[0]?.id_pregunta
    }).subscribe({
      next: () => {
        this.bloqueada = true;
        // arrancar countdown de 24h desde ahora
        this.iniciarCountdown(24 * 60 * 60 * 1000);
      },
      error: (err) => console.error('Error marcando daily complete', err)
    });
  }


  private resetState(): void {
    this.currentQuestionIndex = 0;
    this.answeredQuestionsCount = 0;
    this.userAnswers = {};
    this.showFeedback = false;
    this.feedbackCorrecta = false;
    this.feedbackRespuestaCorrectaTexto = '';
    this.isFinalizado = false;
  }
}
