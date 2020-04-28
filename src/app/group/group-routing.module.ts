import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {GroupListComponent} from './group-list/group-list.component';
import {GroupCreateComponent} from './group-create/group-create.component';
import {GroupDeleteComponent} from "./group-delete/group-delete.component";

const routes: Routes = [
    {
        path: '',
        component: GroupListComponent,
        children: [
            {
                path: 'delete/:id',
                component: GroupDeleteComponent
            }
        ]
    },
    {
        path: 'create',
        component: GroupCreateComponent
    },
    {
        path: ':id',
        component: GroupCreateComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GroupRoutingModule {
}
