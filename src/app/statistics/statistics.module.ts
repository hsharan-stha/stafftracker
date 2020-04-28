import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {StatisticsRoutingModule} from './statistics-routing.module';
import {StatisticsComponent} from './statistics/statistics.component';
import {CriteriaComponent} from './criteria/criteria.component';
import {EmployeeDataComponent} from './employee-data/employee-data.component';
import {MovementMonitoringComponent} from './movement-monitoring/movement-monitoring.component';
import {GeozoneVisitsComponent} from './geozone-visits/geozone-visits.component';
import {SelectInputModule} from '@shared/select-input/select-input.module';
import {DatePickerModule} from '@shared/date-picker/date-picker.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {SearchIconFormModule} from '@shared/search-icon-form/search-icon-form.module';

import {TypeAheadModule} from '@shared/type-ahead/type-ahead.module';
import {Ng2GoogleChartsModule} from 'ng2-google-charts';
import {TimeTrackingComponent} from './time-tracking/time-tracking.component';
import {TrackMovementsComponent} from './track-movements/track-movements.component';
import {MapModule} from '@shared/map/map.module';
import {EmployeeMonitoringComponent} from './employee-monitoring/employee-monitoring.component';
import {NotificationsExplanatoryNotesComponent} from './notifications-explanatory-notes/notifications-explanatory-notes.component';
import {SharedModule} from "@shared/share.module";

import {GetWindowHeightService} from 'src/app/service/get-window-height.service';
import {MovementMonitoringService} from './movement-monitoring/service/movement-monitoring.service';
import {InvalidMessageModule} from '@shared/form-message/invalid-message.module';
import {NotificationsExplanatoryNotesService} from './notifications-explanatory-notes/notifications-explanatory-notes-service/notifications-explanatory-notes.service';
import {NotificationAndExplanatoryAdapter} from './notifications-explanatory-notes/adapter/NotificationAndExplanatory.adapter';
import {DatePipe} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {SortingModule} from "@shared/directive-sorting/sorting.module";
import {ErrorInterceptorProvider} from '../core/http-interceptor.service'
import {GeozoneVisitsAdapter, GeozoneVisitsExtraParamsAdapter} from "./geozone-visits/adapter/geozone-visits.adapter";
import {GeozoneVisitsService} from "./geozone-visits/service/geozone-visits.service";
import {
  MovementMonitoringAdapter,
  MovementMonitoringExtraAdapter
} from "./movement-monitoring/adapter/movement-monitoring.adapter";
import { TimeTrackingService } from "./time-tracking/service/time-tracking.service";
import {TimeTrackingAdapter, TimeTrackingExtraAdapter} from "./time-tracking/adapter/time-tracking.adapter";

@NgModule({
  declarations: [StatisticsComponent, CriteriaComponent, EmployeeDataComponent, MovementMonitoringComponent, GeozoneVisitsComponent, TimeTrackingComponent, TrackMovementsComponent, EmployeeMonitoringComponent, NotificationsExplanatoryNotesComponent],
  imports: [
    CommonModule,
    StatisticsRoutingModule,
    SelectInputModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    DatePickerModule,
    SearchIconFormModule,
    TypeAheadModule,
    Ng2GoogleChartsModule,
    MapModule,
    SharedModule,
    InvalidMessageModule,
    TranslateModule,
    SortingModule
  ],
  providers: [
    {provide: 'windowObject', useValue: window},
    GetWindowHeightService,
    MovementMonitoringService,
    NotificationsExplanatoryNotesService,
    NotificationAndExplanatoryAdapter,
    DatePipe,
    GeozoneVisitsService,
    GeozoneVisitsAdapter,
    GeozoneVisitsExtraParamsAdapter,
    ErrorInterceptorProvider,
    MovementMonitoringAdapter,
    MovementMonitoringExtraAdapter,
    TimeTrackingService,
    TimeTrackingAdapter,
    TimeTrackingExtraAdapter
  ],
  exports: [
    StatisticsComponent
  ]
})
export class StatisticsModule {
}
