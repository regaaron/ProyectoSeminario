import { AfterViewChecked, AfterViewInit, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { User } from 'firebase/auth';
import { DailyService } from '../services/daily.service';

import { driver } from "driver.js";
import "driver.js/dist/driver.css";


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements AfterViewInit{
  menuOpen = false;
  racha: number = 0;
  user: User | null = null;
  dailyAvailable = false;
  constructor(private authService: AuthService, private router: Router,private http: HttpClient) { }
  ngAfterViewInit(): void {

    const driveObj = driver({
      showProgress: true,
      steps:[
        {
          element: '#Inicio',
          popover: {
            title: 'Inicio',
            description: 'Aquí puedes ver informacion general de tu perfil',
            side: 'right'
          }
        },
        {
          element: '#Temas',
          popover: {
            title: 'Temas',
            description: 'Aqui podras ver los temas y subtemas acerca de este curso',
            side: 'left'
          }
        },
        {
          element: '#Examen',
          popover: {
            title: 'Examen',
            description: 'Aqui podras encontrar examenes diferentes cada dia',
            side: 'right'
          }
        },
        {
          element: '#Resultados',
          popover: {
            title: 'Resultados',
            description: 'Aqui podras ver tus resultados y racha de examenes',
            side: 'left'
          }
        }
      ]
    });

    driveObj.drive();
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
    this.user = this.authService.currentUser;

    const uid = this.user?.uid;
    if (uid) {
      this.getRacha(uid);
      this.checkDailyQuestion(uid); // ✅ nuevo
    }
  }

  checkDailyQuestion(uid: string) {
    const key = `dailyQuestionTime_${uid}`;
    const lastTimestamp = localStorage.getItem(key);

    if (!lastTimestamp) {
      // Nunca ha contestado → habilitar pregunta diaria
      this.dailyAvailable = true;
      return;
    }

    const lastDate = new Date(lastTimestamp);
    const now = new Date();

    const diffMs = now.getTime() - lastDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    // Si han pasado 24 horas → habilitar
    this.dailyAvailable = diffHours >= 24;
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
