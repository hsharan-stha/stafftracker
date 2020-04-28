import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { InvalidMessageModule } from '@shared/form-message/invalid-message.module';

@NgModule({
  declarations: [ImageUploadComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InvalidMessageModule
  ],
  exports: [
    ImageUploadComponent
  ]
})
export class ImageUploadModule { }
