import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeozoneListComponent } from './geozone-list/geozone-list.component';
import { GeozoneRoutingModule } from './geozone-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { UnifunTooltipsModule } from '@shared/unifun-tooltips/unifun-tooltips.module';
import { SharedModule } from '@shared/share.module';

import {  InvalidMessageModule } from '@shared/form-message/invalid-message.module';
import { SearchIconFormModule } from '@shared/search-icon-form/search-icon-form.module';
import { DbEmpActionModule } from '@shared/db-emp-action/db-emp-action.module';
import { GeozoneCreateComponent } from './geozone-create/geozone-create.component';
import { ColorPickerModule } from '@shared/color-picker/color-picker.module';
import { MapModule } from '@shared/map/map.module';

import { NgxPaginationModule } from 'ngx-pagination';
import {GetWindowHeightService} from 'src/app/service/get-window-height.service';
import { GeozoneService } from 'src/app/geozone/service/geozone.service';
import { GeozoneAdapter,GeozoneTblAdapter } from 'src/app/geozone/adapter/geozone.adapter';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorInterceptorProvider } from '../core/http-interceptor.service';
import { GeozoneDeleteComponent } from './geozone-delete/geozone-delete.component';
import {DeleteDialogModule} from "@shared/delete-dialog/delete-dialog.module";
import {SortingModule} from "@shared/directive-sorting/sorting.module";

@NgModule({
  declarations: [ GeozoneListComponent, GeozoneCreateComponent, GeozoneDeleteComponent,],
  imports: [
    CommonModule,
    GeozoneRoutingModule,
    SharedModule,
    NgbModule,
    UnifunTooltipsModule,
    InvalidMessageModule,
    SearchIconFormModule,
    DbEmpActionModule,
    ColorPickerModule,
    MapModule,
    NgxPaginationModule,
    TranslateModule,
    DeleteDialogModule,
    SortingModule
  ],
  providers: [ 
    { provide: 'windowObject', useValue: window},
    GetWindowHeightService,
    ErrorInterceptorProvider,
    GeozoneService,
    GeozoneAdapter,
    GeozoneTblAdapter
  ]


})
export class GeozoneModule { }
