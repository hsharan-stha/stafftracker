import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationComponent } from './notification/notification.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { ServiceNotificationComponent } from './service-notification/service-notification.component';

const routes: Routes = [
    {
        path: '',
        component: NotificationComponent
    },
    {
        path: 'list',
        component: NotificationListComponent
    },
    {
        path: 'servicenotification',
        component: ServiceNotificationComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule { }
