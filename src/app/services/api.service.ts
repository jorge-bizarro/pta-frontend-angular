import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl: string = environment.baseUrl;

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
