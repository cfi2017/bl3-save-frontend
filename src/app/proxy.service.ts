import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { environment } from '../environments/environment';
import { switchMapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProxyService {

  constructor(
    private http: HttpClient
  ) { }

  keepAlive(): Observable<{ pwd: string }> {
    return timer(1000, 5000).pipe(
      switchMapTo(this.http.get<{ pwd: string }>(`${environment.proxy}/stats`))
    );
  }

  getStatus(): Observable<{pwd: string}> {
    return this.http.get<{pwd: string}>(`${environment.proxy}/stats`);
  }

  cd(path: string): Observable<{pwd: string}> {
    return this.http.post<{pwd: string}>(`${environment.proxy}/cd`, {path});
  }

  getCharacters(): Observable<{name: string, experience: number, id: number}[]> {
    return this.http.get<{name: string, experience: number, id: number}[]>(`${environment.proxy}/characters`);
  }

  getCharacter(id): Observable<any> {
    return this.http.get<any>(`${environment.proxy}/characters/${id}`);
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(`${environment.proxy}/profile`);
  }

}
