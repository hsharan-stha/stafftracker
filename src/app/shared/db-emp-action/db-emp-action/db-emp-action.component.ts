import { Component, OnInit,Input, Output, EventEmitter, } from '@angular/core';

@Component({
  selector: 'db-emp-action',
  templateUrl: './db-emp-action.component.html',
  styleUrls: ['./db-emp-action.component.css']
})
export class DbEmpActionComponent implements OnInit {
    constructor() { }
    viewMessage:string;
    outerWidth: number;
    sendMessage: string;
    outerWidthForSMS: number;
    firstBtnName: string;
    secondBtnName: string;
    thirdBtnName: string;
    thirdBtnMsg: string;
    outerWidthForDelete: number;
    wrapperClass: string = "table-action";
    @Output() viewBtnClicked: EventEmitter<string> = new EventEmitter();
    @Output() sendMsgbtnClicked: EventEmitter<string> = new EventEmitter();
    @Output() deleteItemBtnClicked: EventEmitter<string> = new EventEmitter();
    
        
    ngOnInit() {
    }
  

    viewEmpDetail(){
      this.viewBtnClicked.emit();
    }
        
    sendEmpMessage(){
        this.sendMsgbtnClicked.emit();
    }

    deleteItem(){
        this.deleteItemBtnClicked.emit();
    }

}
