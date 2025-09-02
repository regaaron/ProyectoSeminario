import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Subtema{
  id: number;
  nombre: string;
}

export interface Tema{
  id: number;
  nombre: string;
  descripcion: string;
  icono: string;
  subtemas: Subtema[];
}
@Injectable({
  providedIn: 'root'
})
export class TemasService {
  private apiUrl = 'http://localhost:3000/api/temas';


  constructor(private http: HttpClient) { }

  getTemas(): Observable<Tema[]>{
    return this.http.get<Tema[]>(this.apiUrl);
  }
}
