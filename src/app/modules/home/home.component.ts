import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { DoorTypeEnum } from 'src/app/enums/door-type';
import { IApiResponse } from 'src/app/interfaces/api-response';
import { ICampus } from 'src/app/interfaces/campus';
import { IDoor } from 'src/app/interfaces/door';
import { IDoorType } from 'src/app/interfaces/door-type';
import { ILevel } from 'src/app/interfaces/level';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  doorForm = new FormGroup({
    campus: new FormControl('', Validators.required),
    level: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required)
  });

  matcher = new MyErrorStateMatcher();

  campusList: ICampus[] = [{
    code: 'HYO',
    name: 'HUANCAYO'
  }, {
    code: 'LIM',
    name: 'LIMA'
  }, {
    code: 'AQP',
    name: 'AREQUIPA'
  }, {
    code: 'CUZ',
    name: 'CUZCO'
  }]

  levelList: ILevel[] = [{
    code: 'UCCI',
    name: 'UNIVERSIDAD'
  }, {
    code: 'IESC',
    name: 'INSTITUTO'
  }]

  doorTypeList: IDoorType[] = [{
    code: DoorTypeEnum.CHECKIN,
    name: 'INGRESO'
  }, {
    code: DoorTypeEnum.CHECKOUT,
    name: 'SALIDA'
  }, {
    code: DoorTypeEnum.BOTH,
    name: 'INGRESO - SALIDA'
  }]

  constructor(
    private router: Router,
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
  }

  init(): void {
    if (!this.doorForm.valid) {
      return;
    }

    const { campus, level } = this.doorForm.value;

    this.apiService.getToken({ campus: campus.code, level: level.code })
      .subscribe(
        (responseData: IApiResponse) => {
          const { ok, data, error } = responseData;

          if (ok) {
            localStorage.setItem('pta-token', data.token);
            this.router.navigate(['checkin-checkout'], {
              state: {
                door: this.doorForm.value as IDoor
              }
            });
          } else {
            alert(error)
          }
        }
      )
  }

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
