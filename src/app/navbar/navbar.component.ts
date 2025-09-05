import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  menuOpen = false;
  racha: number = 0;
  user: User | null = null;
  constructor(private authService: AuthService, private router: Router,private http: HttpClient) { }

  logout() {
    this.authService.logOut()
      .then(() => {
        console.log('Sesión cerrada ✅');
        this.router.navigate(['/landing-page']); // redirige al landing o login
      })
      .catch(err => console.error('Error cerrando sesión', err));
  }

  ngOnInit(){
    this.getRacha(this.authService.currentUser?.uid!);
    this.user=this.authService.currentUser

  }

  async getRacha(uid: string) {
    try {
      const res: any = await this.http.get(`http://localhost:3000/auth/racha/${uid}`).toPromise();
      this.racha = res.racha;
      console.log('Racha obtenida:', this.racha);
    } catch(error) {
      console.error('Error fetching user streak:', error);
    }
  }

}
