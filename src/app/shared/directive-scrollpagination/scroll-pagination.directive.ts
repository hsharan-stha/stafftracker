import {Directive, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
    selector: '[appScrollPagination]',
})
export class ScrollPaginationDirective {
    @Output() scrollPage = new EventEmitter();

    constructor() {
    }

    @HostListener('scroll', ['$event']) onScrollEvent($event) {
        let eventTarget = (<HTMLInputElement>$event.target);
        let isInBottom = (eventTarget.scrollHeight - eventTarget.scrollTop) === eventTarget.clientHeight;

        if (isInBottom === true) {
            this.scrollPage.emit(isInBottom);
        }
    }
}
