import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ElementRef } from '@angular/core';
import { Tema, TemasService } from '../services/temas.service';
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

  constructor(private temasService: TemasService){}

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
  

}
