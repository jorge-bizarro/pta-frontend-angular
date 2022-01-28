import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckinCheckoutRoutingModule } from './checkin-checkout-routing.module';
import { CheckinCheckoutComponent } from './checkin-checkout.component';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [
    CheckinCheckoutComponent
  ],
  imports: [
    CommonModule,
    CheckinCheckoutRoutingModule,
    MaterialModule
  ]
})
export class CheckinCheckoutModule { }
