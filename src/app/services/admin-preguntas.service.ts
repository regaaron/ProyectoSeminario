import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminPreguntasService {

  private API_URL = 'http://localhost:3000/admin/preguntasai';

  constructor(private http: HttpClient) { }

  getPreguntas(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  deletePregunta(id: number) {
  return this.http.delete(`${this.API_URL}/${id}`);
}


}
