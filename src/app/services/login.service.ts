import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient
  ) { }

  login(usuario: string, password: string, onesignal_id: string | undefined | null) {
    return this.http.post(`${environment.base_url}/login`, { usuario, password, onesignal_id });
  }
}
