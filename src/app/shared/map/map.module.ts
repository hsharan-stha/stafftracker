import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { MapContainerComponent } from './map-container/map-container.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        MapComponent,
        MapContainerComponent
    ],
    exports:[
        MapComponent,
        MapContainerComponent
    ]
})
export class MapModule { }


