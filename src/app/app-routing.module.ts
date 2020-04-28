import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  {
    path: '',
    loadChildren: './login/login.module#LoginModule'
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule'
  },
  {
    path: 'get-started-page',
    loadChildren: './get-started-page/get-started-page.module#GetStartedPageModule'
  },
  {
    path: 'main',
    canActivate: [AuthGuard],
    loadChildren: './main/main.module#MainModule'
  }  
  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
