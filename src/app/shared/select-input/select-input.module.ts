import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SelectInputComponent} from './select-input/select-input.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from '@ngx-translate/core';
import {ScrollPaginationModule} from "@shared/directive-scrollpagination/scroll-pagination.module";

@NgModule({
  declarations: [SelectInputComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ScrollPaginationModule
  ],
  exports: [
    SelectInputComponent
  ]
})
export class SelectInputModule {
}
