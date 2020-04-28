import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PositionListComponent} from './position-list/position-list.component';
import {PositionRoutingModule} from './position-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {UnifunTooltipsModule} from '@shared/unifun-tooltips/unifun-tooltips.module';
import {SharedModule} from '@shared/share.module';
import {InvalidMessageModule} from '@shared/form-message/invalid-message.module';
import {SearchIconFormModule} from '@shared/search-icon-form/search-icon-form.module';
import {PositionCreateComponent} from './position-create/position-create.component';
import {DbEmpActionModule} from '@shared/db-emp-action/db-emp-action.module';
import {PositionAdapter, PositionFormAdapter} from "./adapter/position.adapter";
import {PositionService} from "./service/position.service";

import {NgxPaginationModule} from "ngx-pagination";
import {GetWindowHeightService} from "../service/get-window-height.service";
import {PositionDeleteComponent} from './position-delete/position-delete.component';
import {DeleteDialogModule} from "@shared/delete-dialog/delete-dialog.module";
import {SortingModule} from "@shared/directive-sorting/sorting.module";
import { ErrorInterceptorProvider } from '../core/http-interceptor.service';

@NgModule({
    declarations: [PositionListComponent, PositionCreateComponent, PositionDeleteComponent],
    imports: [
        CommonModule,
        PositionRoutingModule,
        SharedModule,
        NgbModule,
        UnifunTooltipsModule,
        InvalidMessageModule,
        SearchIconFormModule,
        DbEmpActionModule,
        NgxPaginationModule,
        DeleteDialogModule,
        SortingModule
    ],
    providers: [
        PositionAdapter,
        PositionService,
        PositionFormAdapter,
        ErrorInterceptorProvider,
        //HeaderInterceptorProvider,
        {provide: 'windowObject', useValue: window},
        GetWindowHeightService

    ]


})
export class PositionModule {
}
