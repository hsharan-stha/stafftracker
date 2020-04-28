import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ScheduleCreateComponent} from './schedule-create/schedule-create.component';
import {ScheduleListComponent} from './schedule-list/schedule-list.component';
import {ScheduleComponent} from './schedule/schedule.component';
import {ScheduleDeleteComponent} from "./schedule-delete/schedule-delete.component";

const routes: Routes = [
    {
        path: '',
        component: ScheduleComponent,
        children: [
            {
                path: '', component: ScheduleListComponent,
                children: [
                    {
                        path: 'delete/:id',
                        component: ScheduleDeleteComponent
                    }
                ]
            },
            {path: 'create', component: ScheduleCreateComponent},
            {path: ':id', component: ScheduleCreateComponent},
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ScheduleRoutingModule {
}
