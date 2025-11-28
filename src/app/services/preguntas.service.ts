import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreguntasService {


  private API_URL = 'https://egelpro-backend-production.up.railway.app/admin/preguntas';
  
    constructor(private http: HttpClient) { }
  
    getPreguntas(): Observable<any[]> {
      return this.http.get<any[]>(this.API_URL);
    }
  
    deletePregunta(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
  
}
