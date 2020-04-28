import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DeleteDialogComponent} from './delete-dialog/delete-dialog.component';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [DeleteDialogComponent],
    imports: [
        CommonModule,
        TranslateModule
    ],
    exports: [DeleteDialogComponent]
})
export class DeleteDialogModule {
}
