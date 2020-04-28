import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DataListDirective} from "@shared/directive-sorting/sorting.directive";

@NgModule({
    declarations: [DataListDirective],
    imports: [
        CommonModule
    ],
    exports: [DataListDirective]
})
export class SortingModule {
}
