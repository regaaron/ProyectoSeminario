import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
interface Testimonial {
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
}

@Component({
  selector: 'app-testimonios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonios.component.html',
  styleUrl: './testimonios.component.css'
})
export class TestimoniosComponent {
testimonials: Testimonial[] = [
    {
      name: "María González",
      role: "Egresada de Sistemas Computacionales",
      image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face",
      content: "EGEL Pro me ayudó a aprobar el examen en mi primer intento. Las preguntas son muy similares a las del examen real y el sistema de seguimiento me motivó a estudiar consistentemente.",
      rating: 5
    },
    {
      name: "Carlos Ramírez",
      role: "Estudiante de 8vo semestre",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content: "La plataforma es increíble. Pude identificar mis áreas débiles y enfocarme en mejorarlas. Los simulacros son idénticos al examen real. Totalmente recomendado.",
      rating: 5
    },
    {
      name: "Ana Martínez",
      role: "Ingeniera en Sistemas",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "Estudié solo 3 meses con EGEL Pro y obtuve un resultado sobresaliente. La metodología es excelente y el contenido está muy bien estructurado.",
      rating: 5
    },
    {
      name: "Luis Fernández",
      role: "Recién graduado",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      content: "Gracias a EGEL Pro pude enfocar mi estudio en lo que realmente importa. El dashboard de progreso me ayudó a mantenerme motivado durante toda la preparación.",
      rating: 5
    },
    {
      name: "Sofía Torres",
      role: "Estudiante de Sistemas",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      content: "La mejor inversión que pude hacer para mi futuro. Las explicaciones son claras y los ejercicios me prepararon perfectamente para el EGEL.",
      rating: 5
    }
  ];

   currentIndex = 0;

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }
}
