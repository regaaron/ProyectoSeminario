import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TemasService, Tema, Subtema } from '../services/temas.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-add-topics',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './add-topics.component.html',
  styleUrls: ['./add-topics.component.css']
})
export class AddTopicsComponent implements OnInit {
  temas: Tema[] = [];
  mostrarFormularioTema = false;
  cargando = false;

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

  cargarTemas(): void {
    this.cargando = true;
    this.temasService.getTemas().subscribe({
      next: (data) => {
        this.temas = data;

        // Inicializa el input de cada tema
        this.temas.forEach((tema) => {
          if (!(tema.id in this.nuevoSubtema)) {
            this.nuevoSubtema[tema.id] = '';
          }
        });

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error al cargar temas:', err);
        this.cargando = false;
      }
    });
  }

  agregarTema(): void {
    if (!this.nuevoTema.nombre?.trim() || !this.nuevoTema.descripcion?.trim() || !this.nuevoTema.icono?.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    this.cargando = true;
    this.temasService.addTema(this.nuevoTema).subscribe({
      next: (temaCreado) => {
        this.temas.push(temaCreado);
        this.limpiarFormularioTema();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error al agregar tema:', err);
        alert('Error al agregar el tema');
        this.cargando = false;
      }
    });
  }

  agregarSubtema(tema: Tema): void {
    const nombreSub = this.nuevoSubtema[tema.id]?.trim();
    if (!nombreSub) {
      alert('Por favor ingresa un nombre para el subtema');
      return;
    }

    this.cargando = true;
    this.temasService.addSubtema(tema.id, nombreSub).subscribe({
      next: (subtemaCreado) => {
        tema.subtemas.push(subtemaCreado);
        this.nuevoSubtema[tema.id] = '';
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error al agregar subtema:', err);
        alert('Error al agregar subtema');
        this.cargando = false;
      }
    });
  }

  eliminarTema(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar este tema y todos sus subtemas?')) return;

    this.cargando = true;
    this.temasService.deleteTema(id).subscribe({
      next: () => {
        this.temas = this.temas.filter((t) => t.id !== id);
        delete this.nuevoSubtema[id];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error al eliminar tema:', err);
        alert('Error al eliminar el tema');
        this.cargando = false;
      }
    });
  }

  eliminarSubtema(tema: Tema, subtemaId: number): void {
    if (!confirm('¿Eliminar este subtema?')) return;

    this.cargando = true;
    this.temasService.deleteSubtema(tema.id, subtemaId).subscribe({
      next: () => {
        tema.subtemas = tema.subtemas.filter((s) => s.id !== subtemaId);
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error al eliminar subtema:', err);
        alert('Error al eliminar el subtema');
        this.cargando = false;
      }
    });
  }

  limpiarFormularioTema(): void {
    this.nuevoTema = { nombre: '', descripcion: '', icono: '', subtemas: [] };
    this.mostrarFormularioTema = false;
  }
}
