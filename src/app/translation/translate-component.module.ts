import { NgModule } from '@angular/core';
import { TranslateComponent } from './translate-component/translate.component';
import { ClosePanelModule } from '@shared/close-panel/close-panel.module';

@NgModule({
  declarations: [
    TranslateComponent
  ],
  imports: [
    ClosePanelModule
  ],
  exports: [
    TranslateComponent
  ]
})
export class TranslateComponentModule { }
