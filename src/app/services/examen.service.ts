import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamenService {
  private apiUrl = 'https://egelpro-backend-production.up.railway.app/examenes'
  constructor(private http: HttpClient) { }

  getExamenes(idExamen: number): Observable<any>{
    return this.http.get(`${this.apiUrl}/${idExamen}`);
  }

  /**
   * Obtiene preguntas para un tema y (opcional) subtema.
   * Se asume que el endpoint acepta query params `tema` y `sub`.
   */
  getExamenPorTemaSub(tema: string, sub?: string, limit: number = 10, ia?: boolean): Observable<any>{
    let params = new HttpParams().set('tema', tema).set('limit', String(limit));
    if(sub){ params = params.set('sub', sub); }
    if(ia !== undefined){ params = params.set('ia', ia ? '1' : '0'); }
    return this.http.get(this.apiUrl, { params });
  }
}
