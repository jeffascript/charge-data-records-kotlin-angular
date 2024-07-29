import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}${url}`, body);
  }

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}${url}`);
  }
}
