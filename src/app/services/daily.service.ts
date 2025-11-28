import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DailyService {
  http: any;

  checkDailyQuestion(uid: string): boolean {
    const key = `dailyQuestionTime_${uid}`;
    const lastTimestamp = localStorage.getItem(key);

    if (!lastTimestamp) {
      // Nunca ha contestado → hay pregunta disponible
      return true;
    }

    const lastDate = new Date(lastTimestamp);
    const diffHours = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60);

    return diffHours >= 24; // true si ya pasaron 24h
  }

  markDailyAsCompleted(uid: string) {
    const key = `dailyQuestionTime_${uid}`;
    localStorage.setItem(key, new Date().toISOString());
  }

  getDailyQuestion() {
    return this.http.get('https://egelpro-backend-production.up.railway.app/daily/question');
  }



}
