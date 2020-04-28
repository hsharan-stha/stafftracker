import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextAreaPlaceholderComponent } from './text-area-placeholder/text-area-placeholder.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TextAreaPlaceholderComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports:[TextAreaPlaceholderComponent]
})
export class TextAreaPlaceholderModule { }
