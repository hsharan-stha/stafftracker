import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'shared-button',
  templateUrl: './shared-button.component.html',
  styleUrls: ['./shared-button.component.css']
})
export class SharedButtonComponent implements OnInit {
  
  @Input() disabledCondition: boolean = false;

  @Input() name : string = "Get Started";
  
  @Input() class: string = "btn";
  
  @Input() iconClass: string = "Icon";
  
  @Input() buttonType: string = "button";

  @Output() buttonClicked : EventEmitter<string> = new EventEmitter();


  @Output() hoverC  = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  btnClicked(){
    this.buttonClicked.emit("checked");
  }

  hover($event){
  }

}
