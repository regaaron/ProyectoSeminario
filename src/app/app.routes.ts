import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SingUpComponent } from './sing-up/sing-up.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainComponentComponent } from './main-component/main-component.component';
import { InicioComponent } from './inicio/inicio.component';
import { TemasComponent } from './temas/temas.component';


export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'landing-page', component: LandingPageComponent },
    { path: 'SingUp', component: SingUpComponent },
    { path: '', component: MainComponentComponent,
        children:[
            {path: '', redirectTo: 'Inicio', pathMatch: 'full'}, // Redirect to Inicio by default
            {path: 'Inicio',  component: InicioComponent},
            {path: 'Temas', component: TemasComponent}, // Assuming InicioComponent is used for Temas as well
        ]
    },/// Assuming Navbar is part of the landing page
    
    { path: '**', pathMatch: 'full', redirectTo: 'landing-page' }
];