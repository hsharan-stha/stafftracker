import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent implements OnInit {

  /*
  for checbox id
   */
  @Input() customID: string;
  @Input() checkBoxFormControl: string;
  @Input() checkBoxFormGroup: string;

  @Output() checkboxChanged: EventEmitter<string> = new EventEmitter();
  @Output() hoverBox: EventEmitter<string> = new EventEmitter();


  constructor() {
  }

  ngOnInit() {
  }

  checkAll($event) {
    this.checkboxChanged.emit($event);
  }

  mouseOverCheckBox($event) {
    this.hoverBox.emit($event);
  }

}
