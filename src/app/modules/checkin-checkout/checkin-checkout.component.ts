import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DoorTypeEnum } from 'src/app/enums/door-type';
import { IDoor } from 'src/app/interfaces/door';
import { ApiService } from 'src/app/services/api.service';

enum CheckingType {
  CHECKOUT = 0,
  CHECKIN = 1,
}

@Component({
  selector: 'app-checkin-checkout',
  templateUrl: './checkin-checkout.component.html',
  styleUrls: ['./checkin-checkout.component.scss']
})
export class CheckinCheckoutComponent implements OnInit {

  door: IDoor;
  student: IStudent;
  documentNumber = new FormControl('', [Validators.required, Validators.minLength(8)]);
  checkingIn: boolean;
  pass: boolean;
  loading: boolean;
  statusMessage: string;
  checklist: ICheckList[];
  capacity: ICapacity;
  actualDate$: Observable<string> = interval(300)
    .pipe(
      map(() => new Date().toLocaleString().replace(/,/g, '').split(' ').reverse().join(' '))
    );

  constructor(
    private router: Router,
    private apiService: ApiService,
  ) {
    this.door = this.router.getCurrentNavigation()?.extras.state?.door as IDoor;

    if (!this.door) {
      this.router.navigate(['home'])
    }
  }

  ngOnInit(): void {
    this.getCapacity();
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.which !== 13)
      return;

    console.log('enter');

    if (this.door.type.code === DoorTypeEnum.CHECKIN)
      this.registerChecking(CheckingType.CHECKIN);

    if (this.door.type.code === DoorTypeEnum.CHECKOUT)
      this.registerChecking(CheckingType.CHECKOUT);

  }

  getCapacity() {
    this.apiService.getCapacity()
      .subscribe(
        (responseHTTP: any) => {
          this.capacity = responseHTTP.data;
        }
      )
  }

  async registerChecking(checkingType: CheckingType) {
    this.checkingIn = (checkingType === CheckingType.CHECKIN);

    if (!this.documentNumber.valid) {
      this.documentNumber.markAsTouched();
      return;
    }

    this.loading = true;

    try {
      const responseHTTP: any = await this.apiService.registerCheckinOrCheckout({
        checkin: this.checkingIn,
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

      if (this.checkingIn) {
        this.statusMessage = pass ? 'Apto para ingresar al campus' : 'No apto para ingresar al campus';
      } else {
        this.statusMessage = 'Se registró la salida';
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
