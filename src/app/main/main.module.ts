import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {MainRoutingModule} from './main-routing.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {EmployeesComponent} from './employees/employees.component';
import {GeozonesComponent} from './geozones/geozones.component';
import {StatisticsComponent} from './statistics/statistics.component';
import {MainLayoutComponent} from './main-layout/main-layout.component';
import {MapModule} from '@shared/map/map.module';
import {PunctualEmployeeComponent} from './punctual-employee/punctual-employee.component';
import {ViolatingEmployeeComponent} from './violating-employee/violating-employee.component';
import {NotificationBlockComponent} from './notification-block/notification-block.component';
import {NotificationService} from '../service/notification.service';
import {ChatService} from '../service/chat.service';
import {TypeAheadModule} from '@shared/type-ahead/type-ahead.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InfoCardModule} from "@shared/info-card/info-card.module";
import {UnifunTooltipsModule} from '@shared/unifun-tooltips/unifun-tooltips.module';
import {DbEmpActionModule} from '@shared/db-emp-action/db-emp-action.module';
import {CompanyInfoModule} from '../company-info/company-info.module';
import {ToggleSwitchModule} from '@shared/toggle-switch/toggle-switch.module';
import {MovementTrackingComponent} from './movement-tracking/movement-tracking.component';
import {DatePickerModule} from '@shared/date-picker/date-picker.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {SharedModule} from '@shared/share.module';
import {TranslateComponentModule} from '../translation/translate-component.module';
import {GetWindowHeightService} from 'src/app/service/get-window-height.service';
import {ClosePanelModule} from '@shared/close-panel/close-panel.module';
import {ErrorInterceptorProvider} from "../core/http-interceptor.service";
import {DateAgoTimeModule} from "@shared/date-ago-time/data-ago-time.module";
import {GeoLocationService} from "../service/geo-location.service";
import {InvalidMessageModule} from "@shared/form-message/invalid-message.module";
import {PunctualEmployeeService} from "./punctual-employee/service/punctual-employee.service";
import {PunctualEmpAdapter} from "./punctual-employee/adapter/punctual-emp.adapter";

@NgModule({
  declarations: [
    SidebarComponent,
    DashboardComponent,
    EmployeesComponent,
    GeozonesComponent,
    StatisticsComponent,
    MainLayoutComponent,
    PunctualEmployeeComponent,
    ViolatingEmployeeComponent,
    NotificationBlockComponent,
    MovementTrackingComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MapModule,
    TypeAheadModule,
    FormsModule,
    ReactiveFormsModule,
    InfoCardModule,
    UnifunTooltipsModule,
    DbEmpActionModule,
    CompanyInfoModule,
    ToggleSwitchModule,
    DatePickerModule,
    NgxPaginationModule,
    SharedModule,
    TranslateComponentModule,
    ClosePanelModule,
    DateAgoTimeModule,
    InvalidMessageModule
  ],
  providers: [
    NotificationService,
    GeoLocationService,
    ChatService,
    {provide: 'windowObject', useValue: window},
    GetWindowHeightService,
    PunctualEmployeeService,
    PunctualEmpAdapter,
    DatePipe,
    ErrorInterceptorProvider
  ],
  exports: [
    SidebarComponent
  ]
})
export class MainModule {
}
