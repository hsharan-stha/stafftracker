import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvalidMessageDirective } from './invalid-message.directive';
import { InvalidMessageComponent } from './invalid-message/invalid-message.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        InvalidMessageDirective,
        InvalidMessageComponent
    ],
    imports: [
        CommonModule,
        TranslateModule
    ],

    exports : [
        InvalidMessageDirective,
        InvalidMessageComponent
    ],
    entryComponents : [
        InvalidMessageComponent
    ]
})
export class InvalidMessageModule { }
