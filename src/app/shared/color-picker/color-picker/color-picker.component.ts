import { Component,ChangeDetectionStrategy, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild,ViewChildren, QueryList, AfterViewChecked,OnChanges, SimpleChanges, ChangeDetectorRef, Renderer2 } from '@angular/core';

import { Color } from './../color.model'

@Component({
  selector: 'color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class ColorPickerComponent implements OnInit {
    colorPickerContainer;

    @ViewChild("container") colorPickerContainerRef : ElementRef ;

    @ViewChildren("colorSpan") colorSpan : QueryList<ElementRef>;

    /**
     * Form label
     *
     * @type {string}
     */
    @Input() label : string = "Choose Color for Geozones";

    /**
     * Color List
     *
     * @type Color
     */
    @Input() colors : Color[] ;
    @Output() inputChanged: EventEmitter<string> = new EventEmitter();

    /**
     * Selected color id
     *
     * @type number
     */
    selectedId : number ;

    scrollLeft ; number ;

    totalToScrollLeft : number ;

    /**
     * Determine whether the scroll reached at end or not
     *
     * @type {boolean}
     */
    isScrollAtEnd : boolean = false ;

    /**
     * Determine whether the scroll is at first or not
     *
     * @type {boolean}
     */
    isScrollAtStart : boolean = true ;

    scrollPosition : number = 0 ;

    @Input() selectedColor : string ;

    constructor(
        private ref: ChangeDetectorRef,
        private renderer: Renderer2
        ) { }

    ngOnInit() {
        this.colorPickerContainer = this.renderer.selectRootElement(this.colorPickerContainerRef);
        this.colorPickerContainer.nativeElement.scrollLeft = 35 ; 
    }

    selected(color){
        this.selectedId = color.id ;
        console.log(color.code);
        this.inputChanged.emit(color);
        this.selectedColor = color.code ;
    }

    /**
     * Show the previous color
     *
     * @return void
     */
    prev() : void {

        if(this.scrollPosition > 0){
            this.scrollPosition -=35 ;
            this.colorPickerContainer.nativeElement.scrollLeft = this.scrollPosition ;
        }

        this.totalToScrollLeft = this.colorPickerContainer.nativeElement.scrollWidth - this.colorPickerContainer.nativeElement.clientWidth ;
        this.isScrollAtEnd = ( this.totalToScrollLeft == this.scrollPosition ) ;
        this.isScrollAtStart = ( this.scrollPosition < 35 ) ;

    }

    /**
     * Show the next color
     *
     * @return void
     */
    next() : void {
        // calculate the scrollWidth - clientWidth

        this.totalToScrollLeft = this.colorPickerContainer.nativeElement.scrollWidth - this.colorPickerContainer.nativeElement.clientWidth ;

        if(this.totalToScrollLeft >= this.scrollPosition ){
            this.scrollPosition +=  35;
            this.colorPickerContainer.nativeElement.scrollLeft = this.scrollPosition ;
        }

        this.isScrollAtEnd = ( this.totalToScrollLeft <= this.scrollPosition ) ;
        this.isScrollAtStart = ( this.scrollPosition  < 35 ) ;


    }

}
