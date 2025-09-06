import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamenService {
  private apiUrl = 'http://localhost:3000/examenes'
  constructor(private http: HttpClient) { }

  getExamenes(idExamen: number): Observable<any>{
    return this.http.get(`${this.apiUrl}/${idExamen}`);
  }
}
