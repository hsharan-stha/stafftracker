import {NgModule} from '@angular/core';
import {DateAgoPipe} from "@shared/date-ago-time/data-ago-time.pipe";
import {CommonModule} from "@angular/common";

@NgModule({
    declarations: [DateAgoPipe],
    imports: [CommonModule],
    exports: [DateAgoPipe]
})
export class DateAgoTimeModule {
}
