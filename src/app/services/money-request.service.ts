import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MoneyRequestService {

  constructor(
    private http: HttpClient
  ) { }

  getAreas() {
    return this.http.get(`${environment.base_url}/areas`);
  }

  getConcepts() {
    return this.http.get(`${environment.base_url}/concepts`);
  }

  registerMoneyRequest(body: any) {
    return this.http.post(`${environment.base_url}/money-request`, body);
  }

  updateMoneyRequest(body: any, id: string) {
    return this.http.put(`${environment.base_url}/money-request/${id}`, body)
  }

  getMoneyRequestsByPage(page: number, userId: string) {
    return this.http.get(`${environment.base_url}/money-requests-by-user?p=${page}&userId=${userId}`);
  }
}
