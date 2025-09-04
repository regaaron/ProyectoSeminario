import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-why-choose-seccion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './why-choose-seccion.component.html',
  styleUrl: './why-choose-seccion.component.css'
})
export class WhyChooseSeccionComponent {
reasons = [
    { icon: 'fa-lightbulb', title: "Enfoque inteligente", description: "Te presentamos preguntas clave que han salido en exámenes reales para que estudies de forma efectiva" },
    { icon: 'fa-graduation-cap', title: "Estudia a tu ritmo", description: "Desde tu celular o computadora, puedes estudiar cuando quieras y practicar a tu ritmo" },
    { icon: 'fa-award', title: "Resultados comprobados", description: "95% de nuestros estudiantes aprueban el EGEL en su primer intento" }
  ];
}
