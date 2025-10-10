import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GridStackOptions, GridStackWidget } from 'gridstack';
import { nodesCB, GridstackComponent, GridstackItemComponent } from 'gridstack/dist/angular';

// Extender GridStackWidget para incluir propiedades personalizadas
interface CustomGridStackWidget extends GridStackWidget {
  title: string;
  desc?: string; // Hacemos la descripción opcional
  type: 'card' | 'chart' | 'notification' | 'metric'; // Nuevo tipo para diferenciar widgets
  customClass?: string; // Para aplicar clases CSS adicionales
  notifications?: string[]; // Para el widget de notificaciones
  value?: string; // Para el widget de métricas
}

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule, GridstackComponent, GridstackItemComponent],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.css'
})
export class ResultadosComponent {
  title = 'EGEL PRO Dashboard';

  public gridOptions: GridStackOptions = {
    margin: 10, // Aumentado el margen entre widgets
    float: false,
    column: 12,
    minRow: 1,
    disableResize: false, // 🔹 Permite redimensionar widgets
    resizable: { // 🔹 Configuración específica para el manejador de redimensionamiento
        handles: 'se' // Solo la esquina inferior derecha
    },
    acceptWidgets: true, // Permite arrastrar nuevos widgets si los hubiera
  };

  public items: CustomGridStackWidget[] = [
    { x: 0, y: 0, w: 3, h: 2, id: '1', title: '📚 Estudiar', desc: 'Repasa conceptos clave con guías interactivas.', type: 'card' },
    { x: 3, y: 0, w: 3, h: 2, id: '2', title: '📝 Examen Simulacro', desc: 'Realiza simulacros con preguntas del banco oficial.', type: 'card' },
    { x: 6, y: 0, w: 3, h: 2, id: '3', title: '📊 Progreso General', desc: 'Monitorea tus avances y fortalezas en cada área.', type: 'card' },
    { x: 9, y: 0, w: 3, h: 2, id: '4', title: '⚡ Retos Diarios', desc: 'Preguntas rápidas para mantener tu nivel al máximo.', type: 'card' },

    { x: 0, y: 2, w: 6, h: 3, id: '5', title: '📈 Rendimiento por Área', desc: 'Visualiza tu desempeño en cada sección del examen.', type: 'chart', customClass: 'card-chart' },
    { x: 6, y: 2, w: 6, h: 3, id: '6', title: '📰 Novedades y Anuncios', type: 'notification', customClass: 'card-notification',
      notifications: [
        'Nueva guía de estudio disponible para el módulo A.',
        'Recordatorio: Webinar de estrategias el 15 de abril.',
        'Actualización de preguntas en la sección de matemáticas.',
        'Consejo del día: No olvides tomar descansos regulares.',
      ]
    },

    { x: 0, y: 5, w: 3, h: 2, id: '7', title: '✅ Exámenes Completados', value: '12', desc: 'simulacros realizados', type: 'metric' },
    { x: 3, y: 5, w: 3, h: 2, id: '8', title: '⏳ Tiempo de Estudio', value: '45h', desc: 'acumuladas este mes', type: 'metric' },
    { x: 6, y: 5, w: 6, h: 2, id: '9', title: '🎯 Tus Metas', desc: 'Establece y sigue tus objetivos de estudio a corto y largo plazo para una preparación efectiva y enfocada.', type: 'card' },
  ];

  public onChange(data: nodesCB) {
    console.log('Cambio detectado:', data);
    // Aquí puedes guardar la nueva disposición de los widgets si es necesario
  }

  public identify(index: number, w: GridStackWidget) {
    return w.id;
  }
}