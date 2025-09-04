import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { format } from 'path';

@Component({
  selector: 'app-caracteristicas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './caracteristicas.component.html',
  styleUrl: './caracteristicas.component.css'
})
export class CaracteristicasComponent {
   features = [
    { icon: 'fa-book-open', title: "Banco de preguntas", description: "Acceso directo a preguntas del EGEL para repasar de forma efectiva" },
    { icon: 'fa-bullseye', title: "Seguimiento", description: "Monitorea tu progreso con estadísticas claras" },
    { icon: 'fa-users', title: "Simulacros", description: "Exámenes simulacro con una retroalimentación" },
    { icon: 'fa-chart-line', title: "Analytics Avanzado", description: "Métricas detalladas de tu rendimiento por área" },
    { icon: 'fa-clock', title: "Estudio Flexible", description: "Estudia a tu ritmo, cuando y donde quieras" },
    { icon: 'fa-shield-halved', title: "Contenido Verificado", description: "Material actualizado y validado por expertos" }
  ];
}
