import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  api_uri = environment.API_URI;

  private httpOptions = {
    headers: {}
  };

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService) {
  }
  initHttpOptionsHeader() {
    const token = this.localStorageService.getItem('token');
    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }
  post<T>(path, body) {
    return this.http.post<T>(`${this.api_uri}${path}`, body, this.httpOptions).toPromise();
  }
  put<T>(path, body) {
    return this.http.put<T>(`${this.api_uri}${path}`, body, this.httpOptions).toPromise();
  }
  get<T>(path) {
    return this.http.get<T>(`${this.api_uri}${path}`, this.httpOptions).toPromise();
  }
  delete<T>(path) {
    return this.http.delete<T>(`${this.api_uri}${path}`, this.httpOptions).toPromise();
  }

}
