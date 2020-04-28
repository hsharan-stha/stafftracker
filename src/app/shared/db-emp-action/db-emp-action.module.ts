import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbEmpActionDirective } from './db-emp-action.directive';
import { DbEmpActionComponent } from './db-emp-action/db-emp-action.component';
import { UnifunTooltipsModule } from '@shared/unifun-tooltips/unifun-tooltips.module';


@NgModule({
    declarations: [DbEmpActionDirective, DbEmpActionComponent],
    imports: [
        CommonModule,
        UnifunTooltipsModule
    ],
    exports:[DbEmpActionDirective,DbEmpActionComponent],
    entryComponents : [
        DbEmpActionComponent
    ]
})
export class DbEmpActionModule { }
