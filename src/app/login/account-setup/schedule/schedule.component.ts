import { Component, OnInit,Injectable, EventEmitter, Output,HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import {NgbTimeStruct, NgbTimeAdapter} from '@ng-bootstrap/ng-bootstrap';
import { KeyCode } from './../../key-code.model';

/**
 * Example of a String Time adapter
 */
@Injectable()
export class NgbTimeStringAdapter extends NgbTimeAdapter<string> {

  fromModel(value: string): NgbTimeStruct {
    if (!value) {
      return null;
    }
    const split = value.split(':');
    return {
      hour: parseInt(split[0], 10),
      minute: parseInt(split[1], 10),
     second: parseInt(split[2], 10)
    };
  }

  toModel(time: NgbTimeStruct): string {
    if (!time) {
      return null;
    }
    return `${this.pad(time.hour)}:${this.pad(time.minute)}`;
  }

  private pad(i: number): string {
    return i < 10 ? `0${i}` : `${i}`;
  }
}


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  providers: [{provide: NgbTimeAdapter, useClass: NgbTimeStringAdapter}],
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  @Output() nextClicked: EventEmitter<any> = new EventEmitter();
  @Output() backClicked: EventEmitter<any> = new EventEmitter();
    scheduleSetupForm: FormGroup;
    constructor(private router: Router, private formBuilder:FormBuilder) { }

    ngOnInit() {
        this.initForm();
    }
  
    initForm(){
        this.scheduleSetupForm = this.formBuilder.group({
            'checkboxMO' : [true],
            'checkboxTU' : [true],
            'checkboxWE' : [true],
            'checkboxTH' : [true],
            'checkboxFR' : [true],
            'checkboxSA' : [''],
            'checkboxSU' : [''],
            'startWorkTime': ['09:00'],
            'endWorkTime': ['18:00'],
            'startLunchTime': ['13:00'],
            'endLunchTime': ['14:00'],
            'loyalty': ['00:05'],
            'trackingFrequency': ['00:15'],
            'days':[''],
            time : [ '13:30:00']
        });
    }
  
  btnBackClicked(){
      this.backClicked.emit();
    //this.router.navigate(['account-setup/company-info']);
  } 
  
    btnNextClicked(){
        if(this.scheduleSetupForm.valid){
            let mo = (this.scheduleSetupForm.get("checkboxMO").value === true ? "1" : "");
            let tu = (this.scheduleSetupForm.get("checkboxTU").value === true ? ",2" : '');
            let we = (this.scheduleSetupForm.get("checkboxWE").value === true ? ",3" : '');
            let th = (this.scheduleSetupForm.get("checkboxTH").value === true ? ",4" : '');
            let fr = (this.scheduleSetupForm.get("checkboxFR").value === true ? ",5" : '');
            let sa = (this.scheduleSetupForm.get("checkboxSA").value === true ? ",6" : '');
            let su = (this.scheduleSetupForm.get("checkboxSU").value === true ? ",7" : '');
            let days = mo + tu + we + th + fr + sa + su;
            if (days.slice(0, 1) === ',') {
              days = days.slice(1, days.length);
            }                         
            this.scheduleSetupForm.get("days").setValue(days);
            this.nextClicked.emit(this.scheduleSetupForm);
        }
        //this.router.navigate(['account-setup/geozone-info']);
    }

 getPopupMessage(){
   return 'Make attention please! Setting the frequency of sending search requests [default value - every 15 minutes, min=5, max-90].'
 }
 
    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
      console.log(event);

      if(event.keyCode=== KeyCode.ENTER_KEY){
          this.btnNextClicked();
      }
    }

}
