import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SearchIconFormComponent} from '@shared/search-icon-form/search-icon-form/search-icon-form.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { TranslateModule } from '@ngx-translate/core';
import {InvalidMessageModule} from "@shared/form-message/invalid-message.module";

@NgModule({
  declarations: [SearchIconFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    InvalidMessageModule
  ],
    exports: [
        SearchIconFormComponent
    ]
})
export class SearchIconFormModule { }
