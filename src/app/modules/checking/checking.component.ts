import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { interval, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { DoorTypeEnum } from 'src/app/enums/door-type';
import { IApiResponse } from 'src/app/interfaces/api-response';
import { IStudent } from 'src/app/interfaces/student';
import { ICapacity } from 'src/app/interfaces/capacity';
import { ICheckList } from 'src/app/interfaces/checklist';
import { IDoor } from 'src/app/interfaces/door';
import { ApiService } from 'src/app/services/api.service';
import { CheckingType } from 'src/app/enums/checking-type';

@Component({
  templateUrl: './checking.component.html',
  styleUrls: ['./checking.component.scss']
})
export class CheckingComponent implements OnInit, AfterViewInit {

  door: IDoor;
  student: IStudent;
  checklist: ICheckList[];
  capacity: ICapacity;
  documentNumber = new FormControl('', [Validators.required, Validators.minLength(8)]);
  checkingIn: boolean;
  pass: boolean;
  loading: boolean;
  statusMessage: string;
  actualDate$: Observable<string> = interval(200)
    .pipe(
      map(() => this.getDatetime())
    );
  @ViewChild('documentNumberInput') documentNumberInput!: ElementRef;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private cd: ChangeDetectorRef,
  ) {
    // this.door = this.router.getCurrentNavigation()?.extras.state?.door as IDoor;

    // if (!this.door) {
    //   this.router.navigate(['home'])
    // }
  }

  getDatetime(): string {
    let date = new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'America/Lima' }).format();
    let time = Intl.DateTimeFormat('en-PE', { hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'America/Lima' }).format()
    return `${time} - ${date}`;
  }

  ngOnInit(): void {
    this.getCapacity();
  }

  ngAfterViewInit(): void {
    this.focusInput();
    this.cd.detectChanges();
  }

  focusInput(): void {
    this.documentNumberInput.nativeElement.focus();
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.which !== 13) return;
    if (this.door.type.code === DoorTypeEnum.CHECKIN) this.registerChecking(CheckingType.CHECKIN);
    if (this.door.type.code === DoorTypeEnum.CHECKOUT) this.registerChecking(CheckingType.CHECKOUT);
  }

  onBlur() {
    if (!this.documentNumber.valid) this.focusInput();
  }

  getCapacity() {
    this.apiService.getCapacity()
      .subscribe(
        (responseHTTP: any) => {
          this.capacity = responseHTTP.data;
        }
      )
  }

  registerChecking(checkingType: CheckingType) {
    this.checkingIn = (checkingType === CheckingType.CHECKIN);

    if (!this.documentNumber.valid) {
      this.documentNumber.markAsTouched();
      this.focusInput();
      return;
    }

    this.loading = true;

    this.apiService.registerCheckinOrCheckout({
      checkin: this.checkingIn,
      documentNumber: this.documentNumber.value
    })
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(
        (responseData: IApiResponse) => {
          const { ok, data, error } = responseData;

          if (ok) {
            const { pass, student, checklist, capacity } = data;

            this.capacity = capacity;
            this.pass = pass;
            this.checklist = checklist;
            this.student = student;

            if (this.checkingIn) {
              this.student.photoUrl = this.apiService.getPhotoStudentURLByPidm(student.pidm);
              this.statusMessage = pass ? 'Apto para ingresar al campus' : 'No apto para ingresar al campus';
            } else {
              this.statusMessage = 'Se registró la salida';
            }
          } else {
            this.student = null;
            this.statusMessage = error.message;
          }

          this.documentNumber.reset();
          this.focusInput();
        },
        (responseError: any) => {
          this.student = null;
          this.statusMessage = null;

          if (responseError instanceof HttpErrorResponse)
            this.statusMessage = responseError.error.error.message;
        }
      )
  }

}
