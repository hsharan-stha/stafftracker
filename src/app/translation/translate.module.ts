import { NgModule } from '@angular/core';
import { TranslatePipe } from './translate.pipe';
import { TranslateComponent } from './translate-component/translate.component';

@NgModule({
  declarations: [
    TranslatePipe
  ],
  imports: [
  ],
  exports: [
    TranslatePipe
  ]
})
export class TranslatePipeModule { }
