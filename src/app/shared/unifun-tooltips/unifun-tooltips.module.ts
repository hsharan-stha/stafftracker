import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnifunTooltipsDirective } from './unifun-tooltips.directive';
import { UnifunTooltipsComponent } from './unifun-tooltips/unifun-tooltips.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [ CommonModule,TranslateModule ],
    declarations: [UnifunTooltipsDirective , UnifunTooltipsComponent],

    exports:[UnifunTooltipsDirective] ,
    entryComponents : [ UnifunTooltipsComponent ]
})

export class UnifunTooltipsModule { }
