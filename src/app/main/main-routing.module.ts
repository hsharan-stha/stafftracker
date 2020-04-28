import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeesComponent } from './employees/employees.component';
import { GeozonesComponent } from './geozones/geozones.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { CompanyInfoComponent } from '../company-info/company-info/company-info.component';
import { SmsComponent } from '../sms/sms/sms.component';
import { AuthGuard } from '../auth.guard';
import { ErrorMessageResolver } from '../core/errorMessageResolver';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: MainLayoutComponent,
        resolve: { message: ErrorMessageResolver },
        
        children: [
            {
                path: '',
                canActivate: [AuthGuard],
                component: DashboardComponent,
                resolve: { message: ErrorMessageResolver }
            },
            {
                path: 'company-info',
                canActivate: [AuthGuard],
                component: CompanyInfoComponent,
                resolve: { message: ErrorMessageResolver }
            },
            {
                path: 'sms',
                canActivate: [AuthGuard],
                resolve: { message: ErrorMessageResolver },
                loadChildren: '../sms/sms.module#SmsModule'
            },

            {
                path: 'schedule',
                canActivate: [AuthGuard],
                resolve: { message: ErrorMessageResolver },
                loadChildren: '../schedule/schedule.module#ScheduleModule'
            },
            {
                path: 'positions',
                canActivate: [AuthGuard],
                resolve: { message: ErrorMessageResolver },
                loadChildren: '../position/position.module#PositionModule'
            },
            {
                path: 'employee',
                canActivate: [AuthGuard],
                resolve: { message: ErrorMessageResolver },
                loadChildren: '../employee/employee.module#EmployeeModule'
            },
            {
                path: 'groups',
                canActivate: [AuthGuard],
                resolve: { message: ErrorMessageResolver },
                loadChildren: '../group/group.module#GroupModule'
            },
            // {
            //     path: 'notification',
            //     loadChildren: '../notification/notification.module#NotificationModule'
            // },
            {
                path: 'notification',
                canActivate: [AuthGuard],
                resolve: { message: ErrorMessageResolver },
                loadChildren: './notification/notification.module#NotificationModule'
            },
            {
                path: 'geozones',
                canActivate: [AuthGuard],
                resolve: { message: ErrorMessageResolver },
                loadChildren: '../geozone/geozone.module#GeozoneModule'
            },
            {
                path: 'statistics',
                canActivate: [AuthGuard],
                resolve: { message: ErrorMessageResolver },
                loadChildren: '../statistics/statistics.module#StatisticsModule'
            },
        ]
    },
    { path: 'instruction-employee', component: EmployeesComponent },
    { path: 'instruction-geozones', component: GeozonesComponent },
    { path: 'instruction-statistics', component: StatisticsComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [
        ErrorMessageResolver
      ]
})
export class MainRoutingModule {
}
