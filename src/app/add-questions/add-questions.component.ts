import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { AdminPreguntasService } from '../services/admin-preguntas.service';
import Swal from 'sweetalert2';
import { PreguntasService } from '../services/preguntas.service';
@Component({
  selector: 'app-add-questions',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './add-questions.component.html',
  styleUrl: './add-questions.component.css'
})
export class AddQuestionsComponent implements OnInit{
  preguntas: any[] = [];
  
    constructor(private preguntasService: PreguntasService,private http: HttpClient) {}
  
    ngOnInit() {
      this.cargarPreguntas();
    }
  
    editarPregunta(id: number) {
    this.http.get(`http://localhost:3000/admin/preguntas/${id}`).subscribe((resp: any) => {
  
      const pregunta = resp.pregunta;
      const respuestas = resp.respuestas;
  
      Swal.fire({
      title: "Editar Pregunta",
      html: `
        <div style="text-align:left; padding:5px">
          
          <label><b>Enunciado:</b></label>
          <textarea id="enun" class="swal2-textarea" style="height:100px;">${pregunta.enunciado}</textarea>
  
          <label><b>Dificultad:</b></label>
          <select id="dif" class="swal2-select" style="width:80%">
              <option value="facil"  ${pregunta.dificultad === "facil" ? "selected" : ""}>Fácil</option>
              <option value="medio"  ${pregunta.dificultad === "medio" ? "selected" : ""}>Medio</option>
              <option value="dificil" ${pregunta.dificultad === "dificil" ? "selected" : ""}>Difícil</option>
          </select>
  
          <hr style="margin:15px 0">
  
          <label><b>Respuestas:</b></label>
  
          ${respuestas.map((r: any, i: number) => `
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px">
  
              <input id="resp${i}" class="swal2-input" 
                    style="margin:0; flex:1"
                    value="${r.texto}">
  
              <label style="font-size:14px; white-space:nowrap;">
                <input type="radio" 
                      name="correcta" 
                      value="${i}"
                      ${r.es_correcta == 1 ? "checked" : ""}>
                Correcta
              </label>
  
            </div>
          `).join("")}
  
        </div>
      `,
      width: "600px",
      confirmButtonText: "Guardar",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      focusConfirm: false,
      preConfirm: () => {
        const enunciado = (document.getElementById("enun") as HTMLTextAreaElement).value;
        const dificultad = (document.getElementById("dif") as HTMLSelectElement).value;
  
        const nuevasRespuestas = respuestas.map((r: any, i: number) => ({
          id_respuesta: r.id_respuesta,
          texto: (document.getElementById(`resp${i}`) as HTMLInputElement).value,
          es_correcta: Number(
          (document.querySelector(`input[name="correcta"]:checked`) as HTMLInputElement)?.value
          ) === i ? 1 : 0
  
  
        }));
  
        return { enunciado, dificultad, respuestas: nuevasRespuestas };
      }
    }).then(result => {
      if (result.isConfirmed) {
        this.actualizarPregunta(id, result.value);
      }
    });
  
  
    });
  }
  
  actualizarPregunta(id: number, data: any) {
    this.http.put(`http://localhost:3000/admin/preguntas/${id}`, data)
      .subscribe(resp => {
        Swal.fire("Actualizado", "La pregunta fue actualizada correctamente", "success");
        this.cargarPreguntas(); // refrescar tabla
      });
  }
    cargarPreguntas() {
       this.preguntasService.getPreguntas().subscribe(data => {
        this.preguntas = data;
        console.log(this.preguntas);
      });
    }
  
  eliminar(id: number) {
    Swal.fire({
      title: '¿Eliminar pregunta?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
  
        this.preguntasService.deletePregunta(id).subscribe({
          next: () => {
            Swal.fire(
              'Eliminada',
              'La pregunta ha sido eliminada correctamente.',
              'success'
            );
  
            // Actualizar tabla local sin recargar la página
            this.preguntas = this.preguntas.filter(p => p.id_pregunta !== id);
          },
          error: (err:any) => {
            console.error(err);
            Swal.fire(
              'Error',
              'Ocurrió un error al eliminar la pregunta.',
              'error'
            );
          }
        });
  
      }
    });
  }
  
  

}
