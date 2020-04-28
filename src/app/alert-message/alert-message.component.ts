import {Component, OnInit, Input, Output, EventEmitter, HostListener} from '@angular/core';
 

@Component({
    selector: 'app-alert-message',
    templateUrl: './alert-message.component.html',
    styleUrls: ['./alert-message.component.css']
})
export class AlertMessageComponent implements OnInit {

    
    dismissTime: any;

    @Input() data;

    @Output() close: EventEmitter<boolean> = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
        this.remove();
    }

    /**
     * Ouput event when click on close button
     *
     * @return void
     */
    dismiss() {
        this.close.emit(true);
    }

    @HostListener('mouseover')
    onMouseOver() {
        clearInterval(this.dismissTime);
    }

    @HostListener('mouseout')
    onMouseOut() {
        this.remove();
    }

    /**
     * Remove a alert component
     *
     * @return void
     */
    remove() {
       
        let fadeOutTime = 2000;
        if (this.data.fadeOutTime) {
            fadeOutTime = this.data.fadeOutTime;
        }
        this.dismissTime = setTimeout(() => {
            this.dismiss();
        }, fadeOutTime);
    }
}
