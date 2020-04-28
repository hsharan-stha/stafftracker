import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

 
 
import { SharedButtonComponent } from './shared-button/shared-button.component';

@NgModule({
  declarations: [SharedButtonComponent],
  imports: [
    CommonModule 
  ],
  exports : [
    SharedButtonComponent
  ]
})
export class SharedButtonModule { }
