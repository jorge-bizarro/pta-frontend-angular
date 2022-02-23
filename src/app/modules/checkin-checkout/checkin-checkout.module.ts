import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckinCheckoutRoutingModule } from './checkin-checkout-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { CheckinCheckoutComponent } from './checkin-checkout.component';


@NgModule({
  declarations: [
    CheckinCheckoutComponent,
  ],
  imports: [
    CommonModule,
    CheckinCheckoutRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ]
})
export class CheckinCheckoutModule { }
