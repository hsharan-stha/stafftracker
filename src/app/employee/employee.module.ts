import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeComponent } from './employee/employee.component';
import { MainModule } from '../main/main.module';
import { Router } from '@angular/router';
import { SearchIconFormModule } from '@shared/search-icon-form/search-icon-form.module';
import { SelectInputModule } from '@shared/select-input/select-input.module';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { EmployeeCreateComponent } from './employee-create/employee-create.component';
import { ImageUploadModule } from '@shared/image-upload/image-upload.module';
import { TextMaskModule } from 'angular2-text-mask';

import { SharedButtonModule } from '@shared/shared-button/shared-button.module';

import { DbEmpActionModule } from '@shared/db-emp-action/db-emp-action.module';
import { TranslateModule } from '@ngx-translate/core';

import { NgxPaginationModule } from 'ngx-pagination';
import {GetWindowHeightService} from 'src/app/service/get-window-height.service';

import { EmployeeService } from './service/employee.service';
import {ErrorInterceptorProvider, HeaderInterceptorProvider} from "../core/http-interceptor.service";
import {EmployeeAdapter, EmployeeTblAdapter} from "./adapter/employee.adapter";
import { InvalidMessageModule } from '@shared/form-message/invalid-message.module';
import { PositionService } from 'src/app/position/service/position.service';
import { PositionAdapter,PositionFormAdapter } from 'src/app/position/adapter/position.adapter';
import { GroupService } from 'src/app/group/service/group.service';
import { GroupAdapter,GroupFormAdapter,GroupEmpFormAdapter,GroupEmpDeletedFormAdapter } from 'src/app/group/adapter/group.adapter';
import { EmployeeDeleteComponent } from './employee-delete/employee-delete.component';
import {DeleteDialogModule} from "@shared/delete-dialog/delete-dialog.module";
import { CheckboxModule } from '@shared/checkbox/checkbox.module';
import {SortingModule} from "@shared/directive-sorting/sorting.module";

@NgModule({
  declarations: [EmployeeListComponent, EmployeeComponent, EmployeeCreateComponent, EmployeeDeleteComponent],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    MainModule,
    SearchIconFormModule,
    SelectInputModule,
    FormsModule,
    ReactiveFormsModule,
    ImageUploadModule,
    TextMaskModule,
    SharedButtonModule,
    DbEmpActionModule,
    NgxPaginationModule,
    TranslateModule,
    InvalidMessageModule,
    DeleteDialogModule,
    CheckboxModule,
    SortingModule
  ],
  providers: [ 
        EmployeeService,
        EmployeeAdapter,
        EmployeeTblAdapter,
        ErrorInterceptorProvider,
        //HeaderInterceptorProvider,
        PositionService,
        PositionAdapter,
        PositionFormAdapter,
        GroupService,
        GroupAdapter,
        GroupFormAdapter,
        GroupEmpFormAdapter,
        GroupEmpDeletedFormAdapter,
        { provide: 'windowObject', useValue: window},
        GetWindowHeightService
  ]
})
export class EmployeeModule { }
