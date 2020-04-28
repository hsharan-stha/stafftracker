import {
    Directive,
    Inject,
    OnDestroy,
    Input,
    OnInit,
    ElementRef,
    Renderer2,
    HostListener,
    ViewContainerRef,
    ComponentFactoryResolver,
    SimpleChanges
} from '@angular/core';
import {AbstractControl, FormGroupDirective, ControlContainer} from '@angular/forms';
import {Observable, of, merge} from 'rxjs';
import {map, tap, takeUntil} from 'rxjs/operators'

import {InvalidMessageComponent} from './invalid-message/invalid-message.component';
import {componentDestroyed} from 'src/app/core/takeUntil-function';

@Directive({
    selector: '[invalidMessage]'
})
export class InvalidMessageDirective implements OnInit, OnDestroy {

    @Input() invalidMessages;

    @Input() control;

    @Input() customMessage;

    @Input() controlType: string = "input";

    //control : AbstractControl ;

    controlValue$: Observable<any>;

    controlSubscription;

    factoryResolver;

    @Input() position: string = "top";

    @Input() hasSubmitted: boolean = false;

    constructor(
        private el: ElementRef,
        private render: Renderer2,
        private fg: ControlContainer,
        public viewContainerRef: ViewContainerRef,
        @Inject(ComponentFactoryResolver) factoryResolver
    ) {
        this.factoryResolver = factoryResolver;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['invalidMessages']) {
            if (changes['invalidMessages'].currentValue == undefined || changes['invalidMessages'].currentValue == '') {
            } else {
                this.setVisible();
            }
        }

    }

    ngOnInit() {
        //console.log(this.fg.formDirective ? (this.fg.formDirective as FormGroupDirective).form : null);
        //
        let formSubmit$ = (<FormGroupDirective>this.fg).ngSubmit.pipe(
            tap((data) => this.hasSubmitted = true)
        );

        this.controlValue$ = merge(this.control.valueChanges, of(''), formSubmit$);

        this.controlSubscription = this.controlValue$.pipe(takeUntil(componentDestroyed(this))).subscribe(() => {
            this.setVisible();
        });
    }

    get form() {
        return this.fg.formDirective ? (this.fg.formDirective as FormGroupDirective).form : null;
    }

    setVisible() {
        if ((this.control.invalid && (this.control.dirty || this.control.touched || this.hasSubmitted)) && !this.control.disabled) {
            this.render.addClass(this.el.nativeElement.previousElementSibling, "form-control-invalid");
            this.render.removeClass(this.el.nativeElement.previousElementSibling, "search-border");
            this.render.addClass(this.el.nativeElement.parentNode, "new-form-search-icon");
        }

        if (this.control.valid && (!this.el.nativeElement.previousElementSibling.classList.contains("confirm-msg-error"))) {
            this.render.removeClass(this.el.nativeElement.previousElementSibling, "form-control-invalid");
            this.render.addClass(this.el.nativeElement.previousElementSibling, "search-border");
            this.render.removeClass(this.el.nativeElement.parentNode, "new-form-search-icon");

            //this.render.removeClass(this.el.nativeElement,"form-control-invalid");
            this.dest();
        }
    }

//    @HostListener('click',[thissubmitBtn])
//    showErrorMessage(){
//        console.log("Sdfdsf");
//    }
    @HostListener('hover', ['$event', '$target'])
    @HostListener('focusin', ['$event', '$target'])
    @HostListener('mouseenter', ['$event', '$target'])
    showMessage() {

        if(this.control.invalid && (this.control.dirty || this.control.touched || this.hasSubmitted)) {

            const factory = this.factoryResolver.resolveComponentFactory(InvalidMessageComponent);

            let componentRef = this.viewContainerRef.createComponent(factory);
            let instance = (<InvalidMessageComponent>componentRef.instance);

            if (this.control.errors) {

                let errors = Object.keys(this.control.errors);
                console.log(errors);
                for (let i = 0; i < errors.length; i++) {
                    // if (typeof this.invalidMessages != 'undefined' && this.invalidMessages[errors[i]]) {
                    if (typeof this.invalidMessages != 'undefined' && this.invalidMessages[errors[i]]) {
                        instance.text = this.invalidMessages[errors[i]];
                        console.log(instance.text);
                    } else if (this.defaultErrorMessage(errors[i]) && (errors[i] != 'minlength' && errors[i] != 'maxlength')) {
                        instance.text = this.defaultErrorMessage(errors[i]);
                        console.log(instance.text);
                    } else if (errors[i] == 'minlength') {
                        instance.text = this.defaultErrorMessage(errors[i], this.control.errors[errors[i]]['requiredLength']);
                    } else if (errors[i] == 'maxlength') {
                        instance.text = this.defaultErrorMessage(errors[i], this.control.errors[errors[i]]['requiredLength']);
                    } else if (errors[i] == 'pattern') {
                        instance.text = this.defaultPatternErrorMessage(this.control.errors[errors[i]]['requiredPattern']);
                    } else {
                        instance.text = "";
                    }
                    if (this.customMessage) {
                        instance.text = this.customMessage;
                    }
                    break;
                }
                //override instance text if custom message is provided
                // if (this.invalidMessages == '' || this.invalidMessages == null || this.invalidMessages == undefined) {
                //     instance.text = '';
                // }
                // else {
                //     instance.text = this.invalidMessages;
                //     console.log(instance.text);
                // }
            }


            let currentElement = this.render.selectRootElement(<HTMLElement>this.el.nativeElement);

            let offsetTop = currentElement.offsetTop;
            let elementBottomPos = currentElement.getBoundingClientRect().bottom;
            let elementTopPos = currentElement.getBoundingClientRect().top;
            let elementLeftPos = currentElement.getBoundingClientRect().left;
            let elementRightPos = currentElement.getBoundingClientRect().right;

            // console.log(elementRightPos);

            let elementOffsetWidth = currentElement.offsetWidth;

            let totalScreenWidth = window.innerWidth;

            let containerHeight = currentElement.offsetHeight;
            let totalScreenHeight = window.innerHeight;
            let diff = totalScreenHeight - (elementTopPos - offsetTop);

            let offsetBottom = totalScreenHeight - offsetTop;

            // console.log(totalScreenWidth);

            //instance.positionLeft   = elementLeftPos;
            instance.positionRight = (totalScreenWidth - elementRightPos - 5);
            //instance.positionRight = elementRightPos;
            instance.position = this.position;

            if (this.position == "top") {
                // if tooltip in top
                // totalScreenHeight - offsetTop + 5
                // 5 is pointer border width

                instance.positionTopOrBottom = totalScreenHeight - elementTopPos + 12;
            }

            if (this.position == "topWithAbs") {
                let imgElementHeight = currentElement.previousElementSibling.getBoundingClientRect().height;
                instance.positionTopOrBottom = imgElementHeight + 5;
            }

            if (this.position == "bottom") {
                // if tooltip in bottom
                // offsettop + element top + 5

                instance.positionTopOrBottom = (offsetTop + 5 + containerHeight)
            }
        }
    }

    /**
     * Remove a tooltips when mouse leave a div or focus out
     *
     */
    @HostListener('focusout', ['$event', '$target'])
    @HostListener('mouseleave', ['$event', '$target'])
    show() {
        this.dest();
    }

    ngOnDestroy() {
        this.controlSubscription.unsubscribe();
        this.dest();
    }

    /**
     * Destory a observable
     *
     * @return void
     */
    dest(): void {
        this.viewContainerRef.clear();
    }

    match(error) {

        if (this.control.errors) {
            let errors = this.control.errors;

            if (Object.keys(errors).indexOf(error) > -1) {
                return true;
            }

            return false;

        }
    }


    defaultErrorMessage(key: string, value: number = null) {
        let messages = {
            required: "This field is required",
            minlength: "At least " + value + " characters required",
            maxlength: "Maximum " + value + " characters allowed",
            mustMatch: "Password not match"
        }
        return messages[key];
    }

    defaultPatternErrorMessage(key: string, value: number = null) {
        let messages = {
            '^[a-zA-Z0-9_]+$': 'Acceptable to use Latin letters, numbers and "_" sign'
        }
        return messages[key];
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        let currentElement = this.render.selectRootElement(<HTMLElement>this.el.nativeElement);
        if (currentElement.nextElementSibling != null) {
            this.dest();
            this.showMessage();
        }
    }


}

