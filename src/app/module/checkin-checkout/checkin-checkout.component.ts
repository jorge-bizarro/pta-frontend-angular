import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DoorInfo } from 'src/app/class/door-info';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-checkin-checkout',
  templateUrl: './checkin-checkout.component.html',
  styleUrls: ['./checkin-checkout.component.scss']
})
export class CheckinCheckoutComponent implements OnInit {

  doorInfo: DoorInfo;
  documentNumber = new FormControl('', [Validators.required, Validators.minLength(8)]);
  checkingIn: boolean = false;
  checkingOut: boolean = false;

  constructor(
    private router: Router,
    private apiService: ApiService,
  ) {
    this.doorInfo = this.router.getCurrentNavigation()?.extras.state?.doorInfo as DoorInfo;

    if (!this.doorInfo) {
      this.router.navigate(['home'])
    }
  }

  ngOnInit(): void {

  }

  async verify({ checkin }: { checkin: boolean }) {

    if (!this.documentNumber.valid) {
      this.documentNumber.markAsTouched();
      return;
    }

    this.checkingOut = !(this.checkingIn = checkin);

    try {
      const dataResponse: any = await this.apiService.registerCheckinOrCheckout({
        campus: this.doorInfo.campus,
        level: this.doorInfo.level,
        checkin,
        documentNumber: this.documentNumber.value
      }).toPromise();

      const { ok, data: infoResponse } = dataResponse;

      if (!ok) {
        return;
      }

      if (infoResponse.recordedEntryOrExit) {
        alert(checkin ? 'Ingreso registrado' : 'Salida registrado')
      } else {
        alert(`${infoResponse.message}`)
      }

      console.log(infoResponse);

    } catch (error) {
      console.log('customize error', error);
    } finally {
      this.checkingIn = false;
      this.checkingOut = false;
    }

  }

}
