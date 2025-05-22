import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SingUpComponent } from './sing-up/sing-up.component';


export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'landing-page', component: LandingPageComponent },
    { path: 'SingUp', component: SingUpComponent },
    
    { path: '**', pathMatch: 'full', redirectTo: 'landing-page' }
];