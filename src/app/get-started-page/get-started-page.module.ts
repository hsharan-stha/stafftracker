import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GetStartedPageRoutingModule } from './get-started-page-routing.module';
import { SharedButtonModule } from '@shared/shared-button/shared-button.module';

import { GetStartedPageComponent } from './get-started-page/get-started-page.component';

import { UnifunTooltipsModule } from '@shared/unifun-tooltips/unifun-tooltips.module';

import { ColorPickerModule } from '@shared/color-picker/color-picker.module'

import { PickTimeModule } from '@shared/pick-time/pick-time.module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [GetStartedPageComponent],
  imports: [
        CommonModule,
        GetStartedPageRoutingModule,
        UnifunTooltipsModule,
        SharedButtonModule,
        FormsModule,
        ReactiveFormsModule,
        ColorPickerModule,
      PickTimeModule,
      TranslateModule
  ]
})
export class GetStartedPageModule { }
