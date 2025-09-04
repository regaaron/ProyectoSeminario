import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService,
    private router: Router
  ) { }


   loginEmail() {
    this.authService.loginEmail(this.email, this.password)
      .then(() => {
        console.log('Login exitoso ✅');
        // redirigir dentro de main
        this.router.navigate(['/main/Inicio']); 
        // aquí puedes redirigir a otra ruta
      })
      .catch(err =>{
        let mensaje = 'Ocurrió un error. Intenta de nuevo.';
        if(err.code === 'auth/user-not-found'){
          mensaje = 'El usuario no existe';
        } else if(err.code === 'auth/wrong-password'){
          mensaje = 'Contraseña incorrecta';
        } else if(err.code === 'auth/invalid-email'){
          mensaje = 'Correo no válido';
        }else if(err.code === 'auth/invalid-credential'){
          mensaje = 'Correo o contraseña no válidos';
        }
        

        Swal.fire({
          icon: 'error',
          title: 'Error en login',
          text: mensaje
        });

        console.error('Error en login', err);
      });
  }

  loginGoogle(){
    this.authService.loginGoogle()
    .then(() => {
      console.log('Login con Google exitoso ✅');
      this.router.navigate(['/main/Inicio']);
      // aquí puedes redirigir a otra ruta
    })
    .catch(err => {
      Swal.fire({
        icon: 'error',
        title: 'Error en login con Google',
        text: 'Ocurrió un error. Intenta de nuevo.'
      })
      console.error('Error en login con Google', err);
    });
  }

}
