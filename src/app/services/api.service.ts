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
    return this.httpClient.post(`${this.baseUrl}/api/v1/pta/checkin-checkout`, requestBody);
  }

  getCapacity() {
    return this.httpClient.get(`${this.baseUrl}/api/v1/pta/capacity`);
  }

  getPhotoStudentURLByPidm(pidm: number) {
    return this.httpClient.get(`${this.baseUrl}/api/v1/pta/photo?pidm=${pidm}`, { responseType: 'arraybuffer' });
  }

  getCampus() {
    return this.httpClient.get(`${this.baseUrl}/api/v1/pta/campus`);
  }

  getLevel(id: number) {
    return this.httpClient.get(`${this.baseUrl}/api/v1/pta/level?campus=${id}`);
  }

}
