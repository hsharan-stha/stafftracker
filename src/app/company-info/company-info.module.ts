import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import { CompanyInfoRoutingModule } from './company-info-routing.module';
import { CompanyInfoComponent } from './company-info/company-info.component';

import { ImageUploadModule } from '@shared/image-upload/image-upload.module';
import { TextMaskModule } from 'angular2-text-mask';

import { SharedButtonModule } from '@shared/shared-button/shared-button.module';

import { DbEmpActionModule } from '@shared/db-emp-action/db-emp-action.module';
import { TranslateModule } from '@ngx-translate/core';
import { CompanyInfoService } from './service/company-info.service';
import {ErrorInterceptorProvider} from "../core/http-interceptor.service";
import {CompanyInfoAdapter,CompanyInfoFormAdapter} from "./adapter/company-info.adapter";
import { InvalidMessageModule } from '@shared/form-message/invalid-message.module';
import {ScheduleService} from "src/app/schedule/service/schedule.service";
import {ScheduleAdapter} from "src/app/schedule/adapter/schedule.adapter";
import { GeozoneService } from 'src/app/geozone/service/geozone.service';
import {GeozoneAdapter,GeozoneTblAdapter} from "src/app/geozone/adapter/geozone.adapter";

@NgModule({
  declarations: [CompanyInfoComponent],
  imports: [
    CommonModule,
    CompanyInfoRoutingModule,
    TextMaskModule,
    ImageUploadModule,
    FormsModule,
    ReactiveFormsModule,
    SharedButtonModule,
    DbEmpActionModule,
    TranslateModule,
    InvalidMessageModule                                                          
  ],
  exports:[
        CompanyInfoComponent
  ],
   providers: [ 
        CompanyInfoService,
        ErrorInterceptorProvider,
        CompanyInfoAdapter,
        CompanyInfoFormAdapter,
        ScheduleService,
        GeozoneService,
        ScheduleAdapter,
        GeozoneAdapter,
        GeozoneTblAdapter
   ]
})
export class CompanyInfoModule { }
