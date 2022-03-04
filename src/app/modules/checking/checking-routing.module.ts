import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckingComponent } from './checking.component';

const routes: Routes = [{
  path: '',
  component: CheckingComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckingRoutingModule { }
