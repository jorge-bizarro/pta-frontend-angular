import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-checkin-checkout',
  templateUrl: './checkin-checkout.component.html',
  styleUrls: ['./checkin-checkout.component.scss']
})
export class CheckinCheckoutComponent implements OnInit {

  doorInfo: IDoor;
  student: IStudent;
  documentNumber = new FormControl('', [Validators.required, Validators.minLength(8)]);
  checkingIn: boolean;
  pass: boolean;
  loading: boolean;
  statusMessage: string;
  checklist: ICheckList[];
  capacity: ICapacity;
  actualDate: string;

  constructor(
    private router: Router,
    private apiService: ApiService,
  ) {
    this.doorInfo = this.router.getCurrentNavigation()?.extras.state?.doorInfo as IDoor;

    if (!this.doorInfo) {
      this.router.navigate(['home'])
    }

    this.actualDate = new Date().toLocaleString().replace(/,/g, '');
  }

  ngOnInit(): void {
    this.getCapacity();
  }

  getCapacity() {
    this.apiService
      .getCapacity()
      .subscribe(
        (responseHTTP: any) => {
          this.capacity = responseHTTP.data;
        }
      )
  }

  async verify(checkin: boolean) {

    if (!this.documentNumber.valid) {
      this.documentNumber.markAsTouched();
      return;
    }

    this.loading = true;
    this.checkingIn = checkin;

    try {
      const responseHTTP: any = await this.apiService.registerCheckinOrCheckout({
        checkin,
        documentNumber: this.documentNumber.value
      }).toPromise();

      const { ok, data, error } = responseHTTP;

      if (!ok) {
        this.student = null;
        this.statusMessage = error.message;
        throw error;
      }

      const { pass, student, checklist, capacity } = data;
      this.capacity = capacity;
      this.pass = pass;
      this.student = student;
      this.checklist = checklist;

      if (checkin) {
        // Si el estudiante está ingresando al campus
        this.statusMessage = pass ? 'Apto para ingresar al campus' : 'No apto para ingresar al campus';
      } else {
        // Si el estudiante está saliendo del campus
        this.statusMessage = 'Se registró la salida del estudiante';
      }

      console.log(data);

    } catch (error) {
      this.student = null;
      this.statusMessage = null;

      if (error instanceof HttpErrorResponse) {
        this.statusMessage = error.error.error.message;
      }

      console.log('customize error', error);
    } finally {
      this.loading = false;
    }
  }

}

interface IDoor {
  campus: any;
  level: any;
  type: any;
}

interface IStudent {
  name: string;
  lastname: string;
  studentCode: string;
  photoUrl: string;
}

interface ICheckList {
  icon: string;
  description: string;
}

interface ICapacity {
  actualCapacityValue: number;
  updateCapacityValue: number;
  maxCapacityValue: number;
}
