import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatisticsComponent } from './statistics/statistics.component';
import { CriteriaComponent } from './criteria/criteria.component';
import { EmployeeDataComponent } from './employee-data/employee-data.component';
import { MovementMonitoringComponent } from './movement-monitoring/movement-monitoring.component';
import { GeozoneVisitsComponent } from './geozone-visits/geozone-visits.component';
import { TimeTrackingComponent } from './time-tracking/time-tracking.component';
import { TrackMovementsComponent } from './track-movements/track-movements.component';
import { EmployeeMonitoringComponent } from './employee-monitoring/employee-monitoring.component';
import {NotificationsExplanatoryNotesComponent} from './notifications-explanatory-notes/notifications-explanatory-notes.component';
import { EmployeeDataResolver } from './employee-data/resolver/EmployeeDataResolver';
import { TimeTrackingResolver } from './time-tracking/resolver/TimeTrackingResolver';

const routes: Routes = [
    {
        path: '',
        component: StatisticsComponent,
        children : [
            {path: '', component: CriteriaComponent},
            {path: 'employee-data', resolve: { data_resolve: EmployeeDataResolver },component: EmployeeDataComponent},
            {path: 'movement-monitoring', component: MovementMonitoringComponent},
            {path: 'geozone-visits', component: GeozoneVisitsComponent},
            {path: 'geozone-visits/:id', component: GeozoneVisitsComponent},
            {path: 'time-tracking', resolve: { data_resolve: TimeTrackingResolver },component: TimeTrackingComponent},
            {path: 'track-movements', component: TrackMovementsComponent},
            {path: 'employee-monitoring', component: EmployeeMonitoringComponent},
            {path: 'notification-explanatory', component: NotificationsExplanatoryNotesComponent}
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[EmployeeDataResolver,TimeTrackingResolver]
})
export class StatisticsRoutingModule { }
