import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@NgModule({
    imports: [
        MaterialModule,
    ],
    exports: [
        NavbarComponent,
    ],
    declarations: [
        NavbarComponent
    ],
    providers: [],
})
export class SharedModule { }
