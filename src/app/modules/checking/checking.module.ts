import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckingRoutingModule } from './checking-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { CheckingComponent } from './checking.component';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  declarations: [
    CheckingComponent,
  ],
  imports: [
    CommonModule,
    CheckingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
  ]
})
export class CheckingModule { }
