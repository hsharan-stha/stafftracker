import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PickTimeComponent} from './pick-time/pick-time.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [PickTimeComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule
    ],
    exports: [PickTimeComponent]
})
export class PickTimeModule {
}
