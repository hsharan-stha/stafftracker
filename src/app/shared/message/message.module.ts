import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {InputMessageBoxComponent} from './input-message-box/input-message-box.component';
import {ChatService} from './../../service/chat.service';
import {SharedModule} from "@shared/share.module";
import {ScrollPaginationModule} from "@shared/directive-scrollpagination/scroll-pagination.module";


@NgModule({
    declarations: [InputMessageBoxComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ScrollPaginationModule
  ],
    exports: [
        InputMessageBoxComponent,
    ],
    providers: [ChatService]
})
export class MessageModule {
}
