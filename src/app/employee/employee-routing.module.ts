import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeCreateComponent } from './employee-create/employee-create.component';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeDeleteComponent } from './employee-delete/employee-delete.component';

const routes: Routes = [
    {
        path: '',
        component: EmployeeComponent,
        children : [
            {path: '', component: EmployeeListComponent,
                children: [
                    {path: 'delete/:id', component: EmployeeDeleteComponent }
            ]},
            {path: 'create', component: EmployeeCreateComponent},
            {path: ':id', component: EmployeeCreateComponent},
        ]
    }
];


@NgModule({
  declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class EmployeeRoutingModule { }
