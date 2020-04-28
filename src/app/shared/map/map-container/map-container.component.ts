import { Component, OnInit, Output, Input, EventEmitter, SystemJsNgModuleLoader } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
@Component({
  selector: 'map',
  templateUrl: './map-container.component.html',
  styleUrls: ['./map-container.component.css']
})
export class MapContainerComponent implements OnInit {
  isMapShow = true;
  @Output() mapClickEvent: EventEmitter<any> = new EventEmitter();
  @Output() markerClickEvent: EventEmitter<any> = new EventEmitter();
  @Input() enableMarker: Boolean = false; //flag to enable to select/set marker
  @Input() clickableMarker: Boolean = false; //flag to enable to select/set marker
  constructor(
        private translateService: TranslateService
  ) {
    this.translateService.onLangChange
            .pipe(
               // take(1)
            )
            .subscribe((params: LangChangeEvent) => {
              console.log(params);
              this.isMapShow = false;
                setTimeout(()=>{
                  this.isMapShow = true;
                },50);
            });
  }
  ngOnInit() {
  }
  coordinateIconClicked($event){
    this.markerClickEvent.emit($event);
  }
  singleClickOnMap($event){
    this.mapClickEvent.emit($event);
  }

}

