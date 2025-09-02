import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  menuOpen = false;

  constructor(private authService: AuthService, private router: Router) { }

  logout() {
    this.authService.logOut()
      .then(() => {
        console.log('Sesión cerrada ✅');
        this.router.navigate(['/landing-page']); // redirige al landing o login
      })
      .catch(err => console.error('Error cerrando sesión', err));
  }
}
