import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckinCheckoutComponent } from './checkin-checkout.component';

const routes: Routes = [{ path: '', component: CheckinCheckoutComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckinCheckoutRoutingModule { }
