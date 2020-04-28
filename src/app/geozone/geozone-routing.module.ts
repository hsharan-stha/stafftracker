import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeozoneListComponent } from './geozone-list/geozone-list.component';
import { GeozoneCreateComponent } from './geozone-create/geozone-create.component';
import { GeozoneDeleteComponent } from './geozone-delete/geozone-delete.component';

const routes: Routes = [
    {path: '', component: GeozoneListComponent,
        children: [
            {path: 'delete/:id', component: GeozoneDeleteComponent }
    ]},
    {path: 'create', component: GeozoneCreateComponent},
    {path: ':id', component: GeozoneCreateComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeozoneRoutingModule { }
