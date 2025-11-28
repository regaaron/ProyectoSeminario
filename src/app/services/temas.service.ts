import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Subtema {
  id: number;
  nombre: string;
}

export interface Tema {
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
  private apiUrl = 'https://egelpro-backend-production.up.railway.app/api/temas';

  constructor(private http: HttpClient) {}

  getTemas(): Observable<Tema[]> {
    return this.http.get<Tema[]>(this.apiUrl);
  }

  addTema(tema: Partial<Tema>): Observable<Tema> {
    return this.http.post<Tema>(this.apiUrl, tema);
  }

  deleteTema(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`);
  }

  addSubtema(temaId: number, nombre: string): Observable<Subtema> {
    return this.http.post<Subtema>(`${this.apiUrl}/${temaId}/subtemas`, { nombre });
  }

  deleteSubtema(temaId: number, subtemaId: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${temaId}/subtemas/${subtemaId}`);
  }
}
