import { Component } from '@angular/core';
import { User } from 'firebase/auth';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  ngOnInit() {
    this.user = this.authService.currentUser;
    console.log("user en inicio", this.user);
  }
}
