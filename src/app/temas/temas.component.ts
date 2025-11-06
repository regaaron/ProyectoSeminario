import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ElementRef } from '@angular/core';
import { Tema, TemasService } from '../services/temas.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-temas',
  standalone: true,
  imports: [FormsModule,CommonModule,HttpClientModule],
  templateUrl: './temas.component.html',
  styleUrl: './temas.component.css'
})
export class TemasComponent {
  temas: Tema[]= [];
  temaSeleccionado: Tema | null = null;

  constructor(private temasService: TemasService, private router: Router){}

  ngOnInit(): void{
    this.temasService.getTemas().subscribe(data =>{

      this.temas = data;
      console.log(this.temas);
    });
  }

  mostrarSubtemas(tema: Tema){
    this.temaSeleccionado = tema;

    setTimeout(()=>{
      const element = document.getElementById('subtemas');
      if(element){
        element.scrollIntoView({behavior: 'smooth'});
      }
    },100);
  }

  async navegarAExamen(sub: any){
    if(!this.temaSeleccionado) return;
    // Preguntar si quiere usar IA
    const result = await Swal.fire({
      title: '¿Generar preguntas con IA?',
      text: 'Puedes generar nuevas preguntas de vez en cuando usando IA, o usar solo la base de datos.',
      icon: 'question',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Con IA',
      denyButtonText: 'Sin IA',
      cancelButtonText: 'Cancelar'
    });

    if (result.isDismissed) return; // cancelado
    const usarIA = result.isConfirmed; // true si eligió "Con IA"

    const temaNombre = encodeURIComponent(this.temaSeleccionado.nombre);
    const subNombre = sub && sub.nombre ? encodeURIComponent(sub.nombre) : '';

    // Navegar con query param ia=1|0
    const queryParams = { ia: usarIA ? 1 : 0 } as const;
    if(subNombre){
      this.router.navigate(['/main', 'Examen', temaNombre, subNombre], { queryParams });
    } else {
      this.router.navigate(['/main', 'Examen', temaNombre], { queryParams });
    }
  }
  

}
