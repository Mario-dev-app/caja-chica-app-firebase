import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private http: HttpClient
  ) { }

  valideOF(of: string) {
    return this.http.get(`${environment.base_url}/valid-of?of=${of}`);
  }
}
