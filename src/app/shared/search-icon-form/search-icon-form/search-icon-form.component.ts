import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'; 

@Component({
  selector: 'app-search-icon-form',
  templateUrl: './search-icon-form.component.html',
  styleUrls: ['./search-icon-form.component.css']
})
export class SearchIconFormComponent implements OnInit {

  @Input() inputSearchFormControl: any;
  @Input() inputSearchFormGroup: string;
  @Input() customPlaceholder: string;
  @Output() inputChanged : EventEmitter<string> = new EventEmitter();
  @Input() formSubmitted: boolean =  false;

  constructor() { }

  ngOnInit() {
  }

  inputValueChanged(data){
    this.inputChanged.emit(data);
}
}
