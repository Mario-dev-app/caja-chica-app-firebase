import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private http: HttpClient
  ) { }

  getAllActiveAdminUsers() {
    return this.http.get(`${environment.base_url}/usuarios-admin`);
  }

  updateUserData(id: string, body: any) {
    return this.http.put(`${environment.base_url}/usuario/${id}`, body);
  }
}
