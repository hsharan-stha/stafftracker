import {Directive, OnInit, ElementRef, Renderer2, HostListener, Input} from '@angular/core';

@Directive({
    selector: '[closePanel]'
})
export class ClosePanelDirective {
    @Input() targetClass: string = 'abc';

    constructor(
        private el: ElementRef,
        private render: Renderer2) {
    }

    ngOnInit() {
    }

    @HostListener('document:click', ['$event'])
    public onDocumentCfhgfhlick(event: MouseEvent): void {
        const targetElement = event.target as HTMLElement;
        //if (targetElement && !this.el.nativeElement.contains(targetElement) && !targetElement.classList.contains('action-btn') && targetElement.classList.contains('emp-action-btn')) {
        if (targetElement && !this.el.nativeElement.contains(targetElement) && !targetElement.classList.contains(this.targetClass)) {
            this.render.addClass(this.el.nativeElement, "close-panel");
        }
    }
}
