import {
    Directive, ElementRef,
    EventEmitter,
    HostListener,
    Output, Renderer2,
} from '@angular/core';

@Directive({
    selector: '[appDataList]',
})
export class DataListDirective {
    @Output() currentSortOrder = new EventEmitter();
    private order_direction: string = "ASC";

    constructor(private el: ElementRef, private render: Renderer2) {
    }

    @HostListener('click')
    sortOrder() {
        let ArrowDown = this.el.nativeElement.children[0];
        let ArrowUp = this.el.nativeElement.children[1];
        console.log(this.el.nativeElement.attributes['aria-name']);
        let headerName = this.el.nativeElement.attributes['aria-name'].value;
        if ((typeof ArrowUp) === "object") {
            this.removeClasses(ArrowUp, ArrowDown);
            if (this.order_direction === "ASC") {
                this.order_direction = "DESC";
                this.showUp(ArrowUp, ArrowDown);
            } else {
                this.order_direction = "ASC";
                this.showDown(ArrowUp, ArrowDown);
            }
        }
        let sortitems = {
            "order_by": headerName,
            "order_direction": this.order_direction
        };
        this.currentSortOrder.next(sortitems);
    }

    removeClasses(up, down) {
        this.render.removeClass(up, 'hide');
        this.render.removeClass(down, 'hide');
    }

    showUp(up, down) {
        this.render.addClass(up, 'show');
        this.render.removeClass(down, 'show');
        this.render.addClass(down, 'hide');
    }

    showDown(up, down) {
        this.render.removeClass(up, 'show');
        this.render.addClass(up, 'hide');
        this.render.addClass(down, 'show');
    }


}


