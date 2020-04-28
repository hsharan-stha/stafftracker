import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-pick-time',
    templateUrl: './pick-time.component.html',
    styleUrls: ['./pick-time.component.css']
})
export class PickTimeComponent implements OnInit {
    /*
    for form name
     */
    @Input() formName: string;


    /*
    form field name
     */
    @Input() form_control_name: string;


    /*
    time input field id
     */
    @Input() idName: string;
    
    
    /*
    minimum value
     */
    @Input() minValue: string;
    
    
    /*
    maximum value
     */
    @Input() maxValue:string

    /*
    label name
     */
    @Input() label_top: string;


    constructor() {
    }

    ngOnInit() {
    }

}
