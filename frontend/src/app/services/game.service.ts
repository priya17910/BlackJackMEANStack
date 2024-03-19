import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private baseUrl: string = 'http://localhost:5000/api/game';

  constructor(private http: HttpClient) {}

  getAllGames(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  createGame(): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, {});
  }

  getGameById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  dealCards(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/deal/${id}`, {});
  }

  updateGame(id: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, {});
  }

  hitAction(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/hit/${id}`, {});
  }

  standAction(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/stand/${id}`, {});
  }

  endGame(id: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/end/${id}`, {});
  }

  deleteGame(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, {});
  }
}
