import { Component,ChangeDetectionStrategy, OnInit, Input, ElementRef, ViewChild, ChangeDetectorRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'avatar-carousel',
  templateUrl: './avatar-carousel.component.html',
  styleUrls: ['./avatar-carousel.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class AvatarCarouselComponent implements OnInit {

    avatarCarouselContainer;

    @ViewChild("container") avatarCarouselContainerRef : ElementRef ;
 
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

    constructor(
        private ref: ChangeDetectorRef,
        private renderer: Renderer2 
        ) { }

    ngOnInit() {
        this.avatarCarouselContainer = this.renderer.selectRootElement(this.avatarCarouselContainerRef);
        this.avatarCarouselContainer.nativeElement.scrollLeft = 44 ;
    }

    /**
     * Show the previous avatar
     *
     * @return void
     */
    prev() : void {
        if(this.scrollPosition > 0){
            this.scrollPosition -=44 ;
            this.avatarCarouselContainer.nativeElement.scrollLeft = this.scrollPosition ;
        }
        this.totalToScrollLeft = this.avatarCarouselContainer.nativeElement.scrollWidth - this.avatarCarouselContainer.nativeElement.clientWidth ;
        this.isScrollAtEnd = ( this.totalToScrollLeft == this.scrollPosition ) ;
        this.isScrollAtStart = ( this.scrollPosition < 44 ) ;
    }

    /**
     * Show the next avatar
     *
     * @return void
     */
    next() : void {
        this.totalToScrollLeft = this.avatarCarouselContainer.nativeElement.scrollWidth - this.avatarCarouselContainer.nativeElement.clientWidth ;
        if(this.totalToScrollLeft >= this.scrollPosition ){
            this.scrollPosition +=  44;
            this.avatarCarouselContainer.nativeElement.scrollLeft = this.scrollPosition ;
        }
        this.isScrollAtEnd = ( this.totalToScrollLeft <= this.scrollPosition ) ;
        this.isScrollAtStart = ( this.scrollPosition  < 44 ) ;
    }

}
