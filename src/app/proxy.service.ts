import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { environment } from '../environments/environment';
import { switchMapTo } from 'rxjs/operators';
import { Item } from './model';

@Injectable({
  providedIn: 'root'
})
export class ProxyService {

  constructor(
    private http: HttpClient
  ) { }

  keepAlive(): Observable<{ pwd: string, hasProfile: boolean }> {
    return timer(1000, 5000).pipe(
      switchMapTo(this.http.get<{ pwd: string, hasProfile: boolean }>(`${environment.proxy}/stats`))
    );
  }

  getStatus(): Observable<{pwd: string, hasProfile: boolean }> {
    return this.http.get<{pwd: string, hasProfile: boolean }>(`${environment.proxy}/stats`);
  }

  cd(path: string): Observable<{pwd: string}> {
    return this.http.post<{pwd: string}>(`${environment.proxy}/cd`, {pwd: path});
  }

  getCharacters(): Observable<{name: string, experience: number, id: number}[]> {
    return this.http.get<{name: string, experience: number, id: number}[]>(`${environment.proxy}/characters`);
  }

  getCharacter(id): Observable<any> {
    return this.http.get<any>(`${environment.proxy}/characters/${id}`);
  }

  updateCharacter(id, character): Observable<any> {
    return this.http.post<any>(`${environment.proxy}/characters/${id}`, character);
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(`${environment.proxy}/profile`);
  }

  updateProfile(profile): Observable<any> {
    return this.http.post<any>(`${environment.proxy}/profile`, profile);
  }

  getItems(id): Observable<Item[]> {
    return this.http.get<Item[]>(`${environment.proxy}/characters/${id}/items`);
  }

  updateItems(id, items): Observable<Item[]> {
    return this.http.post<Item[]>(`${environment.proxy}/characters/${id}/items`, items);
  }
}
