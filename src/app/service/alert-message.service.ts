import {
    EmbeddedViewRef,
    Injectable,
    ComponentFactoryResolver,
    ComponentRef,
    ApplicationRef,
    Injector, Renderer2
} from '@angular/core'
import {AlertMessageComponent} from "../alert-message/alert-message.component";
import {takeUntil} from 'rxjs/operators';
import {componentDestroyed} from '../core/takeUntil-function';


@Injectable({
    providedIn: 'root'
})
export class AlertMessageService {

    componentRef: ComponentRef<AlertMessageComponent>;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector,
        // private render: Renderer2
    ) {
    }

    /**
     * Show the alert component by attaching to body
     *
     * @param data
     */
    show(data) {

        this.drop();
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertMessageComponent);
        this.componentRef = componentFactory.create(this.injector);

        this.appRef.attachView(this.componentRef.hostView);
        this.componentRef.instance.data = data;
        if (data.destroy !== false) {
            this.componentRef.instance.close.pipe(takeUntil(componentDestroyed(this))).subscribe(
                (data) => this.drop()
            );
        }

        const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        if (data.alertType === "error") {
            this.error(domElem);
        }

        document.body.appendChild(domElem);
    }

    error(domElem) {
        domElem.children[0].classList.remove('modal-alert-succes');
        domElem.children[0].classList.add('modal-alert-error');
    }

    cancel() {
        this.drop();
    }

    /**
     * Drop a component if exists
     *
     * @return void
     */
    private drop() {
        if (this.componentRef) {
            this.appRef.detachView(this.componentRef.hostView);
            this.componentRef.destroy();
        }
    }

    ngOnDestroy() {
    }
}
