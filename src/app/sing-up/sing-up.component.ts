import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sing-up',
  standalone: true,
  imports: [RouterModule,FormsModule],
  templateUrl: './sing-up.component.html',
  styleUrl: './sing-up.component.css'
})
export class SingUpComponent {
  name: string= '';
  email: string= '';
  password: string= '';
  confirmPassword: string= '';

  constructor(private authService: AuthService,private router: Router) { }

  registerEmail(){
    if(this.password !== this.confirmPassword){
       Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Las contraseñas no coinciden'
      });
      return;
    }

    this.authService.registerEmail(this.email,this.password,this.name)
    .then(res=>{
      console.log('Usuario registrado ✅',res);
      this.router.navigate(['/main/Inicio']); // redirige a main o a donde quieras
    })
    .catch(err =>{
      let mensaje = "Ocurrio un error. Intente de nuevo.";
      if(err.code === "auth/email-already-in-use"){
        mensaje = "El correo ya está en uso.";
      }else if(err.code === "auth/invalid-email"){
        mensaje = "El correo no es válido.";
      } else if(err.code === "auth/weak-password"){
        mensaje = "La contraseña es muy débil.";
      }
      console.error('Error en registro',err);

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: mensaje
      });

    });
  }
}
