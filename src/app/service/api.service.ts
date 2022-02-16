import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl: string = 'http://localhost:3000';

  constructor(
    private httpClient: HttpClient
  ) { }

  getToken({ campus, level, doorType }: any) {
    return this.httpClient.post(`${this.baseUrl}/api/v1/auth/get-token`, { campus, level, doorType });
  }

  registerCheckinOrCheckout({ campus, level, checkin, documentNumber }: any) {
    return this.httpClient.post(`${this.baseUrl}/api/v1/person/checkin-checkout`, { campus, level, checkin, documentNumber });
  }

}
