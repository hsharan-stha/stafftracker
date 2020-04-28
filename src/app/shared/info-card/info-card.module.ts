import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoCardComponent } from './info-card/info-card.component';
import { CoordinatePointComponent } from './coordinate-point/coordinate-point.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [InfoCardComponent, CoordinatePointComponent],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports:[
    InfoCardComponent,
    CoordinatePointComponent
    ]
})
export class InfoCardModule { }
