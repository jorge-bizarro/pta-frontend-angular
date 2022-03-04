import { Component, Input, OnInit } from '@angular/core';
import { IDoor } from '../../../interfaces/door';

@Component({
    selector: 'navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})


export class NavbarComponent implements OnInit {
    @Input('door') door: IDoor;

    constructor() { }

    ngOnInit() { }
}
