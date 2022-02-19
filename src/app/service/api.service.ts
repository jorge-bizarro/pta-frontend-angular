import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl: string = 'http://localhost:3000';

  constructor(
    private httpClient: HttpClient
  ) { }

  getToken(requestBody: any) {
    return this.httpClient.post(`${this.baseUrl}/api/v1/auth/get-token`, requestBody);
  }

  registerCheckinOrCheckout(requestBody: any) {
    return this.httpClient.post(`${this.baseUrl}/api/v1/student/checkin-checkout`, requestBody);
  }

  getCapacity() {
    return this.httpClient.get(`${this.baseUrl}/api/v1/student/capacity`);
  }

}
