import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
import { HeroComponent } from "../hero/hero.component";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterModule, HeroComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

}
