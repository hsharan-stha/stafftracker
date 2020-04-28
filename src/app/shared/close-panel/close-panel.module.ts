import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClosePanelDirective } from './close-panel.directive';

@NgModule({
  declarations: [ClosePanelDirective],
  imports: [
    CommonModule
  ],
  exports:[ClosePanelDirective]
})
export class ClosePanelModule { }
