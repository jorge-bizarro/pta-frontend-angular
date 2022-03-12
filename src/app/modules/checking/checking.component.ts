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
import { ICheckListItem } from 'src/app/interfaces/checklist';
import { IDoor } from 'src/app/interfaces/door';
import { ApiService } from 'src/app/services/api.service';
import { CheckingType } from 'src/app/enums/checking-type';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  templateUrl: './checking.component.html',
  styleUrls: ['./checking.component.scss']
})
export class CheckingComponent implements OnInit, AfterViewInit {

  door: IDoor;
  student: IStudent;
  checklist: ICheckListItem[];
  capacity: ICapacity;
  documentNumber = new FormControl('');
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
    private sanitizer: DomSanitizer,
  ) {
    this.door = this.router.getCurrentNavigation()?.extras.state?.door as IDoor;

    if (!this.door) {
      this.router.navigate([''])
    }
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

  onKeydownEnter(): void {
    if (this.door.type.code === DoorTypeEnum.CHECKIN) this.registerChecking(CheckingType.CHECKIN);
    if (this.door.type.code === DoorTypeEnum.CHECKOUT) this.registerChecking(CheckingType.CHECKOUT);
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
    this.loading = true;
    this.student = null;
    this.pass = false;
    this.checklist = [];

    this.apiService.registerCheckinOrCheckout({
      checkin: this.checkingIn,
      documentNumber: this.documentNumber.value
    })
      .pipe(
        finalize(() => {
          this.loading = false;
          this.documentNumber.reset();
          this.focusInput();
        })
      )
      .subscribe(
        (responseData: IApiResponse) => {
          const { ok, data, error } = responseData;

          if (!ok) {
            this.statusMessage = error.message;
            return;
          }

          const { pass, student, checklist, capacity, isEmployee } = data;

          this.capacity = capacity;
          this.pass = pass;
          this.checklist = checklist;
          this.student = student;

          if (!this.checkingIn) {
            this.statusMessage = 'Se registró la salida';
            return;
          }

          if (!student) {
            this.statusMessage = pass ? 'Bienvenido al campus' : 'No apto para ingresar al campus';

            if (isEmployee) this.statusMessage += ' (Docente - Administrativo)';

            return;
          }

          this.statusMessage = pass ? 'Apto para ingresar al campus' : 'No apto para ingresar al campus';

          this.apiService.getPhotoStudentURLByPidm(student.pidm).subscribe((arrayBuffer: ArrayBuffer) => {
            const objectURL = URL.createObjectURL(new Blob([arrayBuffer]));
            this.student.photoUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          });

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
