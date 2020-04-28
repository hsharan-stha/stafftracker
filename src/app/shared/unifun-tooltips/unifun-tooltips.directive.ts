import { Directive, Input, HostListener, ElementRef, ViewContainerRef, ComponentFactoryResolver, Inject, OnDestroy, NgZone, ComponentRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { UnifunTooltipsComponent } from './unifun-tooltips/unifun-tooltips.component';
import { fromEvent, race } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/core/takeUntil-function';

let nextId : number = 0 ; 

@Directive({
    selector : '[utooltips]',
})
export class UnifunTooltipsDirective implements  OnDestroy{

    /**
     * Message to be displayed as tooltips
     * 
     * @type string 
     */
    @Input() message : string ;

    /**
     * Placement of the tooltip
     * 
     * @type string 
     */
    @Input() position : string = "top";

    /**
     * Width of the tooltip container 
     * 
     * @type number 
     */
    @Input() containerWidth : number ;

    /**
     * Max width of tooltip container 
     * 
     * @type number
     */
    @Input() maxWidth : number ;

    /**
     * Disable tooltips 
     * 
     * @type boolean 
     */
    @Input() disable : boolean = false;

    /**
     * Remove a tooltips when window or document is scroll 
     * 
     * @type boolean 
     */
    @Input() remoWhenScroll : boolean = true ; 

    private tooltipContainerId = `ngb-tooltip-${nextId++}`;

    private zoneSubscription : any ; 

    private componentRef : ComponentRef<UnifunTooltipsComponent> ;  

    factoryResolver ;

    constructor(
        private el : ElementRef ,  
        public viewContainerRef : ViewContainerRef , 
        @Inject(ComponentFactoryResolver) factoryResolver,
        private ngZone: NgZone ,
        private renderer : Renderer2,
        private _changeDetector: ChangeDetectorRef,
    ){
        this.factoryResolver = factoryResolver ;

        this.zoneSubscription = ngZone.onStable.pipe(takeUntil(componentDestroyed(this))).subscribe(() => {
             
            if (this.componentRef) {
                this.positionElements( this.el.nativeElement, this.componentRef.location.nativeElement );
            }
        });
    }

    /**
     * Position the element after the component is render in body 
     * 
     * @param host
     * @param target 
     */
    positionElements(host : HTMLElement, target : HTMLElement){

        let clientRect = host.getBoundingClientRect() ; 
       
        let leftPosition ; 
        let topPosition  ; 
        
        // extra 5 is added because of arrow border
        switch(this.position){
            case 'top' : 
                topPosition = clientRect.top - ( target.offsetHeight + 5);
                break ; 
            
            case 'bottom' : 
                topPosition = clientRect.bottom + 5 ; 
                break ; 
        }

           
        leftPosition = clientRect.right - (target.offsetWidth) ; 

        target.style.transform = `translate3d(${Math.round(leftPosition)}px, ${Math.round(topPosition)}px,0px)`;
        
    }

    private getAllStyles(element: HTMLElement) { return window.getComputedStyle(element); }

    /**
     * When mouse focusin or museenter in target element
     * 
     * @return void 
     */
    @HostListener('focusin', ['$event', '$target'])
    @HostListener('mouseenter', ['$event', '$target'])
    click(){
        this.dest(); // first destroy if exists 

        // do not display if there is no message 
        // and if the tooltip is disable 
        if(typeof this.message == "undefined" && !this.disable)
            return ; 
        
        this.renderer.setAttribute(this.el.nativeElement, "aria-describedby", this.tooltipContainerId);
        const factory = this.factoryResolver.resolveComponentFactory(UnifunTooltipsComponent);

        this.componentRef = this.viewContainerRef.createComponent(factory);
        let instance = (<UnifunTooltipsComponent>this.componentRef.instance);
          
        instance.text       = this.message;
        instance.width      = (typeof this.containerWidth == "undefined") ? 200 : this.containerWidth;
        instance.maxWidth   = (typeof this.containerWidth == "undefined") ? 250 : this.maxWidth;
        instance.position   = this.position;
        instance.id         = this.tooltipContainerId;

        this.setRemoveHandler();
         
    }

    /**
     * When  tooltips is remove 
     * 
     * @return void 
     */
    setRemoveHandler(){
        this.ngZone.runOutsideAngular(()=>{

            const scroll$ = fromEvent<UIEvent>(window,'scroll').pipe(filter(event=>this.remoWhenScroll));
            const dscroll$ = fromEvent<UIEvent>(document,'scroll',{capture:true}).pipe(filter(event=>this.remoWhenScroll));

            race<Event>([  scroll$ , dscroll$ ]).pipe(takeUntil(componentDestroyed(this))).subscribe(()=>this.ngZone.run(()=>{
                this.dest();
                this._changeDetector.markForCheck();
            }));
        });
    }

    /**
     * Remove a tooltips when mouse leave a div or focus out
     *
     * @return void 
     */
    @HostListener('focusout', ['$event', '$target'])
    @HostListener('mouseleave', ['$event', '$target'])
    show(){
        this.dest();
    }

    /**
     * When window is resize 
     * 
     * @return void 
     */
    @HostListener("window:resize")
    windowResize(){
        this.zoneSubscription.next("");
    }

    ngOnDestroy(){
        this.dest();
        this.zoneSubscription.unsubscribe();
    }

    /**
     * Destory a observable
     *
     * @return void
     */
    dest() : void {
        this.viewContainerRef.clear();
    }
}