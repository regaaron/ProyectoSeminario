import { AfterViewInit, Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
import { HeroComponent } from "../hero/hero.component";
import { CaracteristicasComponent } from '../caracteristicas/caracteristicas.component';
import { WhyChooseSeccionComponent } from "../why-choose-seccion/why-choose-seccion.component";
import { TestimoniosComponent } from '../testimonios/testimonios.component';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";


@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterModule, HeroComponent, CaracteristicasComponent, WhyChooseSeccionComponent,TestimoniosComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements AfterViewInit{

ngAfterViewInit(): void {

   const seen = localStorage.getItem('tourSeen');
   if(!seen){
     const driverObj = driver({
       showProgress: true,
      
      steps: [
        {
          element: '#btnStart',
          popover: {
            title: 'Comenzar',
            description: 'Inicia aquí tus actividades',
            side: 'bottom'
          }
        },
        {
          element: '#questionsSection',
          popover: {
            title: 'Sección de preguntas',
            description: 'Aquí verás tus preguntas del día.',
            side: 'right'
          }
        },
        {
           element: '#about',
           popover: {
              title: 'Sección de preguntas',
              description: 'Aquí verás tus preguntas del día.',
              side: 'right'
            }
        }
      ]
    });
    
    driverObj.drive();
    localStorage.setItem('tourSeen', 'true'); 
  }
}
menuOpen = false;

toggleMenu() {
  this.menuOpen = !this.menuOpen;
}

closeMenu() {
  this.menuOpen = false;
}

}
