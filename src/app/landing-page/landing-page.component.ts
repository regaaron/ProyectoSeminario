import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
import { HeroComponent } from "../hero/hero.component";
import { CaracteristicasComponent } from '../caracteristicas/caracteristicas.component';
import { WhyChooseSeccionComponent } from "../why-choose-seccion/why-choose-seccion.component";
import { TestimoniosComponent } from '../testimonios/testimonios.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterModule, HeroComponent, CaracteristicasComponent, WhyChooseSeccionComponent,TestimoniosComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

}
