import { Component } from '@angular/core';
import { User } from 'firebase/auth';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { getIdTokenResult } from 'firebase/auth';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  user: any = null;

  constructor(private authService: AuthService) {}

  //obtener usuario al iniciar el componente
  async  ngOnInit() {
    this.user = this.authService.currentUser;
    console.log("user en inicio", this.user);
     if (this.user) {
      const isAdmin = await this.checkAdminRole(this.user);
      console.log("¿Es administrador?", isAdmin);
    } else {
      console.log("No hay usuario autenticado");
    }
  }

  private async checkAdminRole(user: User): Promise<boolean> {
    const tokenResult = await getIdTokenResult(user);
    return tokenResult.claims['admin'] === true;
  }

}
