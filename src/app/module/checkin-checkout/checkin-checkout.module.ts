import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckinCheckoutRoutingModule } from './checkin-checkout-routing.module';
import { CheckinCheckoutComponent } from './checkin-checkout.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CheckinCheckoutComponent
  ],
  imports: [
    CommonModule,
    CheckinCheckoutRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class CheckinCheckoutModule { }
