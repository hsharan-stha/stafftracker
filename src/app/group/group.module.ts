import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GroupListComponent} from './group-list/group-list.component';
import {GroupRoutingModule} from './group-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {UnifunTooltipsModule} from '@shared/unifun-tooltips/unifun-tooltips.module';
import {SharedModule} from '@shared/share.module';

import {InvalidMessageModule} from '@shared/form-message/invalid-message.module';
import {SearchIconFormModule} from '@shared/search-icon-form/search-icon-form.module';
import {SelectInputModule} from '@shared/select-input/select-input.module';
import {DbEmpActionModule} from '@shared/db-emp-action/db-emp-action.module';
import {GroupCreateComponent} from './group-create/group-create.component';
import {CheckboxModule} from '@shared/checkbox/checkbox.module';
import {AvatarCarouselModule} from '@shared/avatar-carousel/avatar-carousel.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {GetWindowHeightService} from 'src/app/service/get-window-height.service';
import {GroupService} from "./service/group.service";
import {GroupAdapter, GroupEmpDeletedFormAdapter, GroupEmpFormAdapter, GroupFormAdapter} from "./adapter/group.adapter";

import {EmployeeService} from "../employee/service/employee.service";
import {EmployeeAdapter, EmployeeTblAdapter} from "../employee/adapter/employee.adapter";
import {ScrollPaginationModule} from "@shared/directive-scrollpagination/scroll-pagination.module";
import {GroupDeleteComponent} from './group-delete/group-delete.component';
import {DeleteDialogModule} from "@shared/delete-dialog/delete-dialog.module";
import {SortingModule} from "@shared/directive-sorting/sorting.module";
import {ImageUploadModule} from "@shared/image-upload/image-upload.module";
import {ErrorInterceptorProvider} from '../core/http-interceptor.service';
import {ScheduleService} from "../schedule/service/schedule.service";
import {ScheduleAdapter} from "../schedule/adapter/schedule.adapter";

@NgModule({
    declarations: [GroupListComponent, GroupCreateComponent, GroupDeleteComponent,],
    imports: [
        CommonModule,
        GroupRoutingModule,
        SharedModule,
        NgbModule,
        UnifunTooltipsModule,
        InvalidMessageModule,
        SearchIconFormModule,
        DbEmpActionModule,
        SelectInputModule,
        CheckboxModule,
        AvatarCarouselModule,
        NgxPaginationModule,
        DeleteDialogModule,
        ScrollPaginationModule,
        SortingModule,
        ImageUploadModule
    ],
    providers: [
        {provide: 'windowObject', useValue: window},
        GetWindowHeightService,
        GroupService,
        GroupAdapter,
        GroupEmpFormAdapter,
        GroupEmpDeletedFormAdapter,
        GroupFormAdapter,
        EmployeeService,
        EmployeeAdapter,
        ScheduleService,
        ScheduleAdapter,
        EmployeeTblAdapter,
        ErrorInterceptorProvider,
        // HeaderInterceptorProvider
    ]

})
export class GroupModule {
}
