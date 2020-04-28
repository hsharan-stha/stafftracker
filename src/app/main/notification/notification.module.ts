import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationRoutingModule } from './notification-routing.module';
import { NotificationComponent } from './notification/notification.component';
import { SharedModule } from '@shared/share.module';
import { DbEmpActionModule } from '@shared/db-emp-action/db-emp-action.module';
import { InvalidMessageModule } from '@shared/form-message/invalid-message.module';
import { CheckboxModule } from '@shared/checkbox/checkbox.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { ServiceNotificationComponent } from './service-notification/service-notification.component';
import { PickTimeModule } from '@shared/pick-time/pick-time.module';
import { SelectInputModule } from '@shared/select-input/select-input.module';
import { TextAreaPlaceholderModule } from '@shared/text-area-placeholder/text-area-placeholder.module';
import { TypeAheadModule } from '@shared/type-ahead/type-ahead.module';
import { ToggleSwitchModule } from '@shared/toggle-switch/toggle-switch.module';
import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
  declarations: [NotificationComponent, NotificationListComponent, ServiceNotificationComponent],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    SharedModule,
    DbEmpActionModule,
    InvalidMessageModule,
    CheckboxModule,
    NgSelectModule,
    PickTimeModule,
    SelectInputModule,
    TextAreaPlaceholderModule,
    TypeAheadModule,
    ToggleSwitchModule,
    NgxPaginationModule
  ]
})
export class NotificationModule { }
