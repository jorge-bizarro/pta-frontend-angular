import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { DoorInfo } from 'src/app/class/door-info';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  doorForm = new FormGroup({
    campus: new FormControl('', Validators.required),
    level: new FormControl('', Validators.required),
    doorType: new FormControl('', Validators.required)
  });

  matcher = new MyErrorStateMatcher();

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

    this.apiService.getToken(this.doorForm.value)
      .subscribe(
        (dataResponse: any) => {
          if (dataResponse.ok) {
            localStorage.setItem('pta-token', dataResponse.data.token);
            this.router.navigate(['checkin-checkout'], {
              state: {
                doorInfo: this.doorForm.value as DoorInfo
              }
            });
          } else {
            alert(dataResponse.error)
          }
        },
        (errorResponse: any) => {
          if (errorResponse instanceof HttpErrorResponse) {
            alert(errorResponse.error)
          }

          console.log('customize error', errorResponse);
        })
  }

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
