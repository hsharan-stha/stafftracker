import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SmsRoutingModule} from './sms-routing.module';
import {SmsComponent} from "./sms/sms.component";
import {MessageModule} from "@shared/message/message.module";
import {AvatarCarouselModule} from "@shared/avatar-carousel/avatar-carousel.module";
import {SharedModule} from "@shared/share.module";
import {SmsService} from "./service/sms.service";
import {SmsAdapter} from "./adapter/sms.adapter";
import {ErrorInterceptorProvider} from "../core/http-interceptor.service";
import {ScrollPaginationModule} from "@shared/directive-scrollpagination/scroll-pagination.module";

@NgModule({
  declarations: [SmsComponent],
  imports: [
    CommonModule,
    SmsRoutingModule,
    MessageModule,
    AvatarCarouselModule,
    SharedModule,
    ScrollPaginationModule

  ],
  providers: [
    SmsService,
    SmsAdapter,
    ErrorInterceptorProvider
  ]
})
export class SmsModule {
}
