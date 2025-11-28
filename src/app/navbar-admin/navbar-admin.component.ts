import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { User } from 'firebase/auth';
import { driver } from "driver.js";

@Component({
  selector: 'app-navbar-admin',
  standalone: true,
  imports: [FormsModule,RouterModule],
  templateUrl: './navbar-admin.component.html',
  styleUrl: './navbar-admin.component.css'
})
export class NavbarAdminComponent {
menuOpen = false;
  racha: number = 0;
  user: User | null = null;
  constructor(private authService: AuthService, private router: Router,private http: HttpClient) { }
  ngAfterViewInit(): void {
  
  }

 
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
      const res: any = await this.http.get(`https://egelpro-backend-production.up.railway.app/auth/racha/${uid}`).toPromise();
      this.racha = res.racha;
      console.log('Racha obtenida:', this.racha);
    } catch(error) {
      console.error('Error fetching user streak:', error);
    }
  }

}
