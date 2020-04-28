import { Component, OnInit, ElementRef, ViewChild, SimpleChanges, Output, EventEmitter, Renderer2 } from '@angular/core';

@Component({
    selector: 'text-area-placeholder',
    templateUrl: './text-area-placeholder.component.html',
    styleUrls: ['./text-area-placeholder.component.css']
})
export class TextAreaPlaceholderComponent implements OnInit {
    textArea;
    @ViewChild('textArea') textAreaRef: ElementRef;
    @Output() childEvent = new EventEmitter<any>();
    textStr ='';
    isCusPlaceholder=true;
    constructor(
        private renderer: Renderer2
    ) { }

    ngOnInit() {
        this.textArea = this.renderer.selectRootElement(this.textAreaRef);
    }
    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);
        
    }
    onClick(e) {
        this.textArea.nativeElement.focus();
    }
    onChange(e){
        if(this.textStr.length>0){
            this.isCusPlaceholder = false;
        } else{
            this.isCusPlaceholder = true;
        }
    }
}
