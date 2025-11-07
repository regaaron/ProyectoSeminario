import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TemasService } from '../services/temas.service';
import { HttpClientModule } from '@angular/common/http';

export interface Subtema {
  id: number;
  nombre: string;
}

export interface Tema {
  id: number;
  nombre: string;
  descripcion: string;
  icono: string;
  subtemas: Subtema[];
}

@Component({
  selector: 'app-add-topics',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './add-topics.component.html',
  styleUrl: './add-topics.component.css'
})
export class AddTopicsComponent implements OnInit {
  temas: Tema[] = [];
  mostrarFormularioTema = false;

  nuevoTema: Partial<Tema> = {
    nombre: '',
    descripcion: '',
    icono: '',
    subtemas: []
  };

  nuevoSubtema: { [key: number]: string } = {};

  constructor(
    private temasService: TemasService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.cargarTemas();
  }

  /**
   * 🔄 Carga todos los temas desde el servidor
   */
  cargarTemas(): void {
    this.temasService.getTemas().subscribe({
      next: (data) => {
        this.temas = data;
        
        // Inicializar nuevoSubtema para cada tema
        this.temas.forEach(tema => {
          if (!this.nuevoSubtema[tema.id]) {
            this.nuevoSubtema[tema.id] = '';
          }
        });

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar temas:', err)
    });
  }

  /**
   * ✅ Agrega un nuevo tema con actualización inmediata
   */
  agregarTema(): void {
    if (!this.nuevoTema.nombre?.trim() || !this.nuevoTema.descripcion?.trim() || !this.nuevoTema.icono?.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    const temaTemporal: Tema = {
      id: Date.now(), // ID temporal
      nombre: this.nuevoTema.nombre,
      descripcion: this.nuevoTema.descripcion,
      icono: this.nuevoTema.icono,
      subtemas: []
    };

    // Actualización optimista
    this.temas = [...this.temas, temaTemporal];
    this.nuevoSubtema[temaTemporal.id] = '';

    this.temasService.addTema(temaTemporal).subscribe({
      next: (temaCreado) => {
        // Reemplazar el tema temporal con el real del servidor
        this.temas = this.temas.map(t => 
          t.id === temaTemporal.id ? temaCreado : t
        );
        
        this.limpiarFormularioTema();
        this.cdr.detectChanges();

  
      },
      error: (err) => {
        console.error('Error al agregar tema:', err);
        // Revertir en caso de error
        this.temas = this.temas.filter(t => t.id !== temaTemporal.id);
        alert('Error al agregar el tema');
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * 🗑️ Elimina un tema con actualización inmediata
   */
  eliminarTema(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar este tema y todos sus subtemas?')) return;

    const temaAEliminar = this.temas.find(t => t.id === id);
    if (!temaAEliminar) return;

    // Actualización optimista
    this.temas = this.temas.filter(t => t.id !== id);
    delete this.nuevoSubtema[id];

    this.temasService.deleteTema(id).subscribe({
      next: () => {
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al eliminar tema:', err);
        // Revertir en caso de error
        if (temaAEliminar) {
          this.temas = [...this.temas, temaAEliminar];
          this.nuevoSubtema[id] = '';
        }
        alert('Error al eliminar el tema');
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * ➕ Agrega un subtema con actualización inmediata
   */
  agregarSubtema(tema: Tema): void {
    const nombreSub = this.nuevoSubtema[tema.id]?.trim();
    if (!nombreSub) {
      alert('Por favor ingresa un nombre para el subtema');
      return;
    }

    const subtemaTemporal: Subtema = {
      id: Date.now(), // ID temporal
      nombre: nombreSub
    };

    // Actualización optimista
    this.temas = this.temas.map(t => 
      t.id === tema.id 
        ? { ...t, subtemas: [...t.subtemas, subtemaTemporal] }
        : t
    );

    this.temasService.addSubtema(tema.id, nombreSub).subscribe({
      next: (subtemaCreado) => {
        // Reemplazar el subtema temporal con el real
        this.temas = this.temas.map(t => 
          t.id === tema.id 
            ? { 
                ...t, 
                subtemas: t.subtemas.map(s => 
                  s.id === subtemaTemporal.id ? subtemaCreado : s
                )
              }
            : t
        );
        
        this.nuevoSubtema[tema.id] = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al agregar subtema:', err);
        // Revertir en caso de error
        this.temas = this.temas.map(t => 
          t.id === tema.id 
            ? { 
                ...t, 
                subtemas: t.subtemas.filter(s => s.id !== subtemaTemporal.id) 
              }
            : t
        );
        alert('Error al agregar el subtema');
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * ❌ Elimina un subtema con actualización inmediata
   */
  eliminarSubtema(tema: Tema, subtemaId: number): void {
    if (!confirm('¿Eliminar este subtema?')) return;

    const subtemaAEliminar = tema.subtemas.find(s => s.id === subtemaId);
    if (!subtemaAEliminar) return;

    // Actualización optimista
    this.temas = this.temas.map(t => 
      t.id === tema.id 
        ? { ...t, subtemas: t.subtemas.filter(s => s.id !== subtemaId) }
        : t
    );

    this.temasService.deleteSubtema(tema.id, subtemaId.toString()).subscribe({
      next: () => {
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al eliminar subtema:', err);
        // Revertir en caso de error
        if (subtemaAEliminar) {
          this.temas = this.temas.map(t => 
            t.id === tema.id 
              ? { ...t, subtemas: [...t.subtemas, subtemaAEliminar] }
              : t
          );
        }
        alert('Error al eliminar el subtema');
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * 🧹 Limpia el formulario de nuevo tema
   */
   limpiarFormularioTema(): void {
    this.nuevoTema = { 
      nombre: '', 
      descripcion: '', 
      icono: '', 
      subtemas: [] 
    };
    this.mostrarFormularioTema = false;

  }
}