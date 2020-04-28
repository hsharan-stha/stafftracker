import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TypeAheadComponent} from './type-ahead/type-ahead.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TagInputModule} from 'ngx-chips';
import {EmployeeService} from "../../employee/service/employee.service";
import {EmployeeAdapter, EmployeeTblAdapter} from "../../employee/adapter/employee.adapter";
import {ErrorInterceptorProvider} from "../../core/http-interceptor.service";
import {GroupService} from "../../group/service/group.service";
import {GroupAdapter} from "../../group/adapter/group.adapter";
import {InvalidMessageModule} from "@shared/form-message/invalid-message.module";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [TypeAheadComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TagInputModule,
    InvalidMessageModule,
    TranslateModule
  ],
  providers: [
    EmployeeService,
    EmployeeAdapter,
    EmployeeTblAdapter,
    GroupService,
    GroupAdapter,
    ErrorInterceptorProvider
  ],
  exports: [TypeAheadComponent]
})
export class TypeAheadModule {
}
