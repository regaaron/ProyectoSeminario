import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recoverpassword',
  standalone: true,
  imports: [FormsModule,RouterLink],
  templateUrl: './recoverpassword.component.html',
  styleUrl: './recoverpassword.component.css'
})
export class RecoverpasswordComponent {
 email: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  enviarCorreo() {
    if (!this.email) {
      Swal.fire('Error', 'Ingresa un correo válido', 'error');
      return;
    }

    this.authService.resetPassword(this.email)
      .then(() => {
        Swal.fire('Correo enviado', 'Revisa tu correo para restablecer la contraseña', 'success');
        console.log('Correo de recuperación enviado ✅');
        this.router.navigate(['/login']); // redirige al login
      })
      .catch(err => {
        Swal.fire('Error', err.message, 'error');
      });
  }
}
