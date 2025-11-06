import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SingUpComponent } from './sing-up/sing-up.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainComponentComponent } from './main-component/main-component.component';
import { InicioComponent } from './inicio/inicio.component';
import { TemasComponent } from './temas/temas.component';
import { authGuard } from './guards/auth.guard';
import { RecoverpasswordComponent } from './recoverpassword/recoverpassword.component';
import { ExamenComponent } from './examen/examen.component';
import { ResultadosComponent } from './resultados/resultados.component';


export const routes: Routes = [
    { path: '', redirectTo: 'landing-page', pathMatch: 'full' }, // Redirect to landing page by default
    { path: 'login', component: LoginComponent },
    { path: 'landing-page', component: LandingPageComponent },
    { path: 'SingUp', component: SingUpComponent },
    { path: 'recoverpassword', component: RecoverpasswordComponent },

    { path: 'main', component: MainComponentComponent,
        
        canActivate: [authGuard], // 🔒 Protegido
        children:[
            {path: '', redirectTo: 'Inicio', pathMatch: 'full'}, // Redirect to Inicio by default
            {path: 'Inicio',  component: InicioComponent},
            {path: 'Temas', component: TemasComponent}, // Assuming InicioComponent is used for Temas as well
            // Rutas para Examen que aceptan tema y subtema (subtema opcional)
            {path: 'Examen/:tema', component: ExamenComponent},
            {path: 'Examen/:tema/:sub', component: ExamenComponent},
            {path: 'Resultados',component: ResultadosComponent},
        ]
    },/// Assuming Navbar is part of the landing page
    
    { path: '**', pathMatch: 'full', redirectTo: 'landing-page' }
];