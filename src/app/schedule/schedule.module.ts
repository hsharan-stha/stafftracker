import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ScheduleRoutingModule} from './schedule-routing.module';
import {ScheduleComponent} from './schedule/schedule.component';
import {ScheduleListComponent} from './schedule-list/schedule-list.component';
import {ScheduleCreateComponent} from './schedule-create/schedule-create.component';
import {NgxPaginationModule} from 'ngx-pagination';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SearchIconFormModule} from '@shared/search-icon-form/search-icon-form.module';

import {DbEmpActionModule} from '@shared/db-emp-action/db-emp-action.module';
import {CheckboxModule} from '@shared/checkbox/checkbox.module';
import {PickTimeModule} from '@shared/pick-time/pick-time.module';
import {SharedButtonModule} from '@shared/shared-button/shared-button.module';

import {GetWindowHeightService} from 'src/app/service/get-window-height.service';
import {EmployeeAdapter, EmployeeTblAdapter} from "../employee/adapter/employee.adapter";
import {ErrorInterceptorProvider, HeaderInterceptorProvider} from "../core/http-interceptor.service";
import {
    GroupEmployeeDeletedFormAdapter,
    GroupEmployeeFormAdapter,
    ScheduleAdapter,
    ScheduleFormAdapter
} from "./adapter/schedule.adapter";
import {ScheduleService} from "./service/schedule.service";
import {SharedModule} from "@shared/share.module";
import {SortingModule} from "@shared/directive-sorting/sorting.module";
import {ScheduleDeleteComponent} from './schedule-delete/schedule-delete.component';
import {DeleteDialogModule} from "@shared/delete-dialog/delete-dialog.module";
import {EmployeeService} from "../employee/service/employee.service";
import {ScrollPaginationModule} from "@shared/directive-scrollpagination/scroll-pagination.module";
import {GroupService} from "../group/service/group.service";
import {GroupAdapter} from "../group/adapter/group.adapter";
import {InvalidMessageModule} from "@shared/form-message/invalid-message.module";

@NgModule({
    declarations: [ScheduleComponent, ScheduleListComponent, ScheduleCreateComponent, ScheduleDeleteComponent],
    imports: [
        CommonModule,
        ScheduleRoutingModule,
        NgxPaginationModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        SearchIconFormModule,
        DbEmpActionModule,
        CheckboxModule,
        PickTimeModule,
        SharedButtonModule,
        SortingModule,
        DeleteDialogModule,
        ScrollPaginationModule,
        InvalidMessageModule
    ],
    exports: [
        ScheduleComponent
    ],
    providers: [
        {provide: 'windowObject', useValue: window},
        GetWindowHeightService,
        ScheduleService,
        ScheduleAdapter,
        ScheduleFormAdapter,
        EmployeeService,
        EmployeeAdapter,
        EmployeeTblAdapter,
        GroupService,
        GroupAdapter,
        GroupEmployeeFormAdapter,
        GroupEmployeeDeletedFormAdapter,
        ErrorInterceptorProvider,
        HeaderInterceptorProvider
    ]
})
export class ScheduleModule {
}
