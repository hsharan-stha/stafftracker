import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'toggle-switch',
    templateUrl: './toggle-switch.component.html',
    styleUrls: ['./toggle-switch.component.css']
})
export class ToggleSwitchComponent implements OnInit {
    @Input() isChecked = true;
    @Input() customClass = 'width-38';
    @Output() checkEvent: EventEmitter<any> = new EventEmitter();
    @ViewChild('top_card') spanEle: ElementRef;
    constructor(
    ) { }

    ngOnInit() {
        // setTimeout(()=>{
        //     this.spanEle.nativeElement.style.setProperty('--bkColor', 'red');
        // },100);
        // document.querySelector("span").style.cssText = "--bkColor: red";
    }
    onChange(e) {
        this.isChecked = !this.isChecked;
        this.checkEvent.emit(this.isChecked);
    }
}