import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LoginLayoutComponent} from './login-layout/login-layout.component';
import { ActivationCodeComponent } from './activation-code/activation-code.component';
import { AccountInfoComponent } from './account-setup/account-info/account-info.component';
import { CompanyInfoComponent } from './account-setup/company-info/company-info.component';
import { ScheduleComponent } from './account-setup/schedule/schedule.component';
//import { ScheduleDisclaimerComponent } from './account-setup/schedule-disclaimer/schedule-disclaimer.component';
import { GeozoneInfoComponent } from './account-setup/geozone-info/geozone-info.component';
import { AccountSetupComponent } from './account-setup/account-setup.component';


const routes: Routes = [
  {
    path:'',
    component: LoginLayoutComponent,
    children: [
        {path:'', component: LoginComponent },
        {path:'sign-up',component: RegisterComponent},
        {path:'activation-code', component:ActivationCodeComponent},
        // {path:'account-setup', children:[
        //     {path:'account-info', component:AccountInfoComponent},
        //     {path:'company-info', component:CompanyInfoComponent},
        //     {path:'schedule', component:ScheduleComponent},
        //     {path:'geozone-info', component:GeozoneInfoComponent}
        // ]},
        {path:'account-setup', component:AccountSetupComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
