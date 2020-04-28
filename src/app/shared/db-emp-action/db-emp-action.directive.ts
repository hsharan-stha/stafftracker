import { Directive,Inject, OnDestroy,  Input, OnInit,Output, ElementRef, Renderer2,HostListener, ViewContainerRef, ComponentFactoryResolver,EventEmitter } from '@angular/core';
    

import { DbEmpActionComponent } from './db-emp-action/db-emp-action.component';

@Directive({
  selector: '[dbempaction]'
})
export class DbEmpActionDirective {
    componentRef
    factoryResolver ;
    
    @Input() viewMessage:string;
    @Input() sendMessage: string;
    @Input() outerWidth: number;
    @Input() outerWidthForSMS: number;
    @Input() outerWidthForDelete: number;
    @Input() firstBtnName: string;
    @Input() secondBtnName: string;
    @Input() thirdBtnName: string;
    @Input() thirdBtnMsg: string;
    @Input() wrapperClass: string;
    @Output() viewBtnClicked: EventEmitter<string> = new EventEmitter();
    @Output() sendMsgbtnClicked: EventEmitter<string> = new EventEmitter();
    @Output() deleteItemBtnClicked: EventEmitter<string> = new EventEmitter();

    constructor(
            private el : ElementRef , 
            public viewContainerRef : ViewContainerRef ,
            public render: Renderer2,
            @Inject(ComponentFactoryResolver) factoryResolver)
    {
        this.factoryResolver = factoryResolver ;
    }
    
    ngOnInit() { 
        this.dest();
    }
    
    @HostListener('click', ['$event', '$target'])      
    showActionBtn(){
        this.dest();
        this.render.addClass(this.el.nativeElement,"hidden-button");
        const factory = this.factoryResolver.resolveComponentFactory(DbEmpActionComponent);

        this.componentRef = this.viewContainerRef.createComponent(factory);
        let instance = (<DbEmpActionComponent>this.componentRef.instance);
        instance.viewMessage = (typeof this.viewMessage == "undefined") ? "Edit employee information" : this.viewMessage;
        instance.sendMessage = (typeof this.sendMessage == "undefined") ? "Send SMS" : this.sendMessage;
        instance.outerWidth = (typeof this.outerWidth == "undefined") ? 220 : this.outerWidth;
        instance.outerWidthForSMS = (typeof this.outerWidthForSMS == "undefined") ? 120 : this.outerWidthForSMS;
        instance.viewBtnClicked =  this.viewBtnClicked;   
        instance.sendMsgbtnClicked =  this.sendMsgbtnClicked;  
        instance.firstBtnName = this.firstBtnName;
        instance.secondBtnName = this.secondBtnName; 
        instance.wrapperClass = (typeof this.wrapperClass == "undefined") ? "table-action" : this.wrapperClass;
        instance.thirdBtnName = this.thirdBtnName;
        instance.thirdBtnMsg = this.thirdBtnMsg;
        instance.outerWidthForDelete = this.outerWidthForDelete;
        instance.deleteItemBtnClicked = this.deleteItemBtnClicked;
    }
            
            
    ngOnDestroy(){
        this.dest();
    }

    /**
     * Destory a observable
     *
     * @return void
     */
    dest() : void {
        this.viewContainerRef.clear();
    }   

    @HostListener('document:click', ['$event'])
    public onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;

      //if (targetElement && !this.el.nativeElement.contains(targetElement) && !targetElement.classList.contains('action-btn') && targetElement.classList.contains('emp-action-btn')) {
      
      if (targetElement && !this.el.nativeElement.contains(targetElement) && !targetElement.classList.contains('action-btn')) {
          this.render.removeClass(this.el.nativeElement,"hidden-button");
          this.dest();
      }
  }
}
