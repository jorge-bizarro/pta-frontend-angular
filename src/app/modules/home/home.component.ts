import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { DoorTypeEnum } from 'src/app/enums/door-type';
import { IApiResponse } from 'src/app/interfaces/api-response';
import { ICampus } from 'src/app/interfaces/campus';
import { IDoor } from 'src/app/interfaces/door';
import { IDoorType } from 'src/app/interfaces/door-type';
import { ApiService } from 'src/app/services/api.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  doorForm = new FormGroup({
    campus: new FormControl('', Validators.required),
    // level: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required)
  });

  matcher = new MyErrorStateMatcher();

  campusList: ICampus[] = []

  // levelList: ILevel[] = [{
  //   code: 'UCCI',
  //   name: 'UNIVERSIDAD'
  // }, {
  //   code: 'IESC',
  //   name: 'INSTITUTO'
  // }]

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
    this.apiService.getCampus()
      .subscribe(
        (responseData: IApiResponse) => {
          const { ok, data, error } = responseData;

          if (ok) {
            this.campusList = data.map((item: any) => ({
              id: item.id,
              name: item.campus
            }) as ICampus)
          } else {
            alert(error)
          }
        }
      )
  }

  init(): void {
    if (!this.doorForm.valid) {
      return;
    }

    const { campus } = this.doorForm.value as IDoor;

    this.apiService.getToken({ idCampus: campus.id })
      .subscribe(
        (responseData: IApiResponse) => {
          const { ok, data, error } = responseData;

          if (ok) {
            localStorage.setItem('pta-token', data.token);
            this.router.navigate(['checking'], {
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
