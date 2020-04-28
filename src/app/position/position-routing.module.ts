import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PositionListComponent} from './position-list/position-list.component';
import {PositionCreateComponent} from './position-create/position-create.component';
import {PositionDeleteComponent} from "./position-delete/position-delete.component";

const routes: Routes = [
    {
        path: '',
        component: PositionListComponent,
        children: [
            {
                path: 'delete/:id',
                component: PositionDeleteComponent
            }
        ]
    },
    {
        path: 'create',
        component: PositionCreateComponent
    },
    {
        path: ':id',
        component: PositionCreateComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PositionRoutingModule {
}
