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

  campusList: ICampus[] = [];
  levelList: ILevel[] = [];
  doorTypeList: IDoorType[] = [{
    code: DoorTypeEnum.CHECKIN,
    name: 'INGRESO'
  }, {
    code: DoorTypeEnum.CHECKOUT,
    name: 'SALIDA'
  }, {
    code: DoorTypeEnum.BOTH,
    name: 'INGRESO - SALIDA'
  }];

  constructor(
    private router: Router,
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.getCampus();
  }

  getCampus() {
    this.apiService.getCampus()
      .subscribe(
        (responseData: IApiResponse) => {
          const { ok, data, error } = responseData;

          if (ok) {
            this.campusList = data.map((item: any) => ({
              id: item.id,
              code: item.campusCode,
              description: item.campusDescription
            }) as ICampus)
          } else {
            console.log(error);
          }
        }
      )
  }

  getLevel() {
    const campusSelected = this.doorForm.controls.campus.value as ICampus;

    this.apiService.getLevel(campusSelected.id)
      .subscribe(
        (responseData: IApiResponse) => {
          const { ok, data, error } = responseData;

          if (ok) {
            this.levelList = data.map((item: any) => ({
              code: item.levelCode,
              description: item.levelDescription
            }) as ILevel)
          } else {
            console.log(error);
          }
        }
      )
  }

  init(): void {
    if (!this.doorForm.valid) {
      return;
    }

    const { campus, level } = this.doorForm.value as IDoor;
    const payload = {
      campusId: campus.id,
      campusCode: campus.code,
      levelCode: level.code,
    }

    this.apiService.getToken(payload)
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
            console.log(error);
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
