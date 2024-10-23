import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ApprovalService {

  constructor(
    private http: HttpClient
  ) { }

  getPendingMoneyRequests(approval_id: string) {
    return this.http.get(`${environment.base_url}/approvals/${approval_id}`);
  }
}
