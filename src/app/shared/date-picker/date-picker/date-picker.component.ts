import { Component, OnInit, Input } from '@angular/core';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter} from './dateformat';

@Component({
  selector: 'date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
   ]
})
export class DatePickerComponent implements OnInit {

  @Input() inputFormControl: any;
  @Input() inputFormGroup: any;
  @Input() minDate: object;
  @Input() maxDate: object;
  @Input() formSubmitted: boolean =  false;
  constructor() { }

  ngOnInit() {
  }

}
