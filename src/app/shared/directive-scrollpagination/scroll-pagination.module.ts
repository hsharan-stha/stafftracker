import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScrollPaginationDirective} from "@shared/directive-scrollpagination/scroll-pagination.directive";

@NgModule({
    declarations: [ScrollPaginationDirective],
    imports: [
        CommonModule
    ],
    exports: [ScrollPaginationDirective]
})
export class ScrollPaginationModule {
}
