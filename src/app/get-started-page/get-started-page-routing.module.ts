import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GetStartedPageComponent } from './get-started-page/get-started-page.component';

const routes: Routes = [
  {
    path: '',
    component: GetStartedPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GetStartedPageRoutingModule { }
