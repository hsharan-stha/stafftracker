import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarCarouselComponent } from './avatar-carousel/avatar-carousel.component';

@NgModule({
  declarations: [AvatarCarouselComponent],
  imports: [
    CommonModule
  ],

    exports : [
        AvatarCarouselComponent
    ]
})
export class AvatarCarouselModule { }
