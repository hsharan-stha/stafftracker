import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommService } from './../services/comm.service';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/core/takeUntil-function';
import { calcNewCoordinate } from '@shared/calcNewCoordinate';
import { TranslateService } from '@ngx-translate/core';
import { debug } from 'util';

declare var ol: any;

@Component({
  selector: 'map-app',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})


export class MapComponent implements OnInit {
  //@Input() toggleCustomCursorEvent;
  @Output() mapClickEvent: EventEmitter<any> = new EventEmitter();
  @Output() markerClickEvent: EventEmitter<any> = new EventEmitter();
  @Input() enableMarker: Boolean = false; //flag to enable to select/set marker
  @Input() clickableMarker: Boolean = false; //flag to enable to select/set marker
  circleColor: any = '#2E5BFF';
  circleRadius: any = 80;
  movementTracker: any;
  markedEmployeeMsisdn;
  markedGeozone;
  message: string;
  ol: any;
  map: any;
  latitude: number = 28.830310010287736;
  longitude: number = 47.01896729492743;
  lat;
  long;
  layerVector;
  isCustomCursorClass: boolean = false;
  markerSource = new ol.source.Vector();
  circleLayer = null;
  circleSource = new ol.source.Vector();
  trackerLayer = null;
  lineSource = new ol.source.Vector();
  circleLayer2 = null;
  circleSource2 = new ol.source.Vector();
  showMap = true;
  zoomsize: number = 16;
  distance: number = 16;

  AutoReload() {
    setInterval(() => {
      this.latitude += 10;
      var source = this.layerVector.getSource();
      source.refresh();
    }, 1000);
  }

  constructor(
    private commService: CommService,
    private translateService: TranslateService
  ) {
    let me = this;

    this.commService.getColor.pipe(takeUntil(componentDestroyed(this))).subscribe(color => {
      me.circleColor = color;
      if (this.circleLayer) {
        me.circleSource.clear(); //clear previous features if exist
        me.setCircle(this.long, this.lat, 0.15);
      }
    });
    this.commService.getCircleRadius.pipe(takeUntil(componentDestroyed(this))).subscribe(radius => {
      me.circleRadius = radius;
      if (this.circleLayer) {
        me.circleSource.clear(); //clear previous features if exist
        me.setCircle(this.long, this.lat, 0.15);
      }
    });


    this.commService.getLatLongCenter
      .pipe(takeUntil(componentDestroyed(this))).subscribe(
        data => {
          this.long = data.longitude;
          this.lat = data.latitude;
          this.commService.getMovementList.pipe(takeUntil(componentDestroyed(this))).subscribe(el => {
            me.movementTracker = el;
            if (this.movementTracker && this.map) {
              this.markerSource.clear(); //clear previous marker if exist
              this.circleSource.clear(); //clear previous features if exist
              this.lineSource.clear(); //clear previous features if exist
              if (this.movementTracker.length > 0) {
                if (this.clickableMarker === true) {
                  this.clickMarker(el);
                }
                me.plotMovementTrack();
              }
            }
          });
          if (this.lat && this.long && this.map) {
            this.enableMarker = true;

            this.markerSource.clear(); //clear previous marker if exist
            this.addMarker(this.long, this.lat);

            this.circleSource.clear(); //clear previous features if exist
            this.setCircle(this.long, this.lat, 0.15);

          }
        }
      )

      this.commService.getCursorPointer
      .pipe(takeUntil(componentDestroyed(this))).subscribe((data: any) => {
        if (this.enableMarker === true && data === true) {
          this.setPointerCursor();
        }
      }
      );
  }

ngOnInit() {
  this.renderMap(this.translateService.currentLang);
  this.commService.currentMessage.pipe(takeUntil(componentDestroyed(this))).subscribe(
    message => {
      this.message = message;
      this.isCustomCursorClass = !this.isCustomCursorClass;
    });
  this.AutoReload();
}

ngOnDestroy() {
}

//
// //for toggling custom cursor
// toggleCustomCursorClass() {
//     this.isCustomCursorClass = !this.isCustomCursorClass;
// }

//   renderMap() {
//     var markerStyle = new ol.style.Style({
//       image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
//         anchorXUnits: 'fraction',
//         anchorYUnits: 'pixels',
//         anchor: [0.5, 23],
//         opacity: 1,
//         src: './assets/icons/blue_pin_fill.svg'
//       }))
//     });
//     this.layerVector = new ol.layer.Vector({
//       source: this.markerSource,
//       style: markerStyle,
//     });
//     this.map = new ol.Map({
//       target: 'map',
//       layers: [
//         new ol.layer.Tile({
//           source: new ol.source.OSM(),
//         }),
//         this.layerVector,
//       ],
//       view: new ol.View({
//         center: ol.proj.fromLonLat([this.latitude, this.longitude]),
//         zoom: 16,
//       })
//     })

renderMap(lang) {
  const tiles_url = `https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png?lang=${lang.toLowerCase()}`;
  var markerStyle = new ol.style.Style({
    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      anchor: [0.5, 23],
      opacity: 1,
      src: './assets/icons/blue_pin_fill.svg'
    }))
  });
  this.layerVector = new ol.layer.Vector({
    source: this.markerSource,
    style: markerStyle,
  });
  this.map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(
          {
            "url": tiles_url
          }
        ),
      }),
      this.layerVector,
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([this.latitude, this.longitude]),
      zoom: this.zoomsize,
    })
  })

  var innerThis = this;
  this.map.on('singleclick', event => {
    var lonLat = ol.proj.toLonLat(event.coordinate);
    if (innerThis.enableMarker) {
      innerThis.markerSource.clear(); //clear previous marker if exist
      innerThis.addMarker(lonLat[0], lonLat[1]);
      innerThis.circleSource.clear(); //clear previous features if exist
      console.log(lonLat);
      this.commService.setCoordinateLIST(lonLat);
      innerThis.setCircle(lonLat[0], lonLat[1], 0.15);
      innerThis.long = lonLat[0];
      innerThis.lat = lonLat[1];
      let test = calcNewCoordinate(47.07980832537643, 28.726404905319203, 7500, 270);
      console.log(test);
      console.log(test['lat'], test['lon']);
      this.commService.setAddressFromLatLong(lonLat);
      this.mapClickEvent.emit(lonLat);
      this.setPointerCursor();
    }
  });
}

setCenter() {
  var view = this.map.getView();
  view.fit(this.markerSource.getExtent(), this.map.getSize());
  // view.setCenter(ol.proj.fromLonLat([this.long, this.lat]));
  if (this.distance >= 0 && this.distance <= 600)
    view.setZoom(this.zoomsize);
}

// setView() {
//   this.map.setView(new ol.View({
//     center: [0, 0],
//     zoom: 4
//   }));
// }

setCircle(lon, lat, opacity) {
  var radius = this.circleRadius; //in meter
  var circle = new ol.geom.Circle(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'), radius);
  var circleFeature = new ol.Feature({
    geometry: circle,
    employee_msisdn: this.markedEmployeeMsisdn,
    geozone_id: this.markedGeozone,
    type: this.movementTracker.length > 0 && this.movementTracker[0].hasOwnProperty('type') ? this.movementTracker[0].type : ''
  });
  var color = ol.color.asArray(this.circleColor); // convert hex color code to array of rgb
  color[3] = opacity; //set opacity
  let colorStr = 'rgba(0, 0, 255,' + opacity + ')'
  var circleStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: color
    }),
    stroke: new ol.style.Stroke({
      color: 'rgba(11,107,242,0.4)',
      width: 1
    }),
  });
  circleFeature.setStyle(circleStyle);
  this.circleSource.addFeature(circleFeature);
  if (!this.circleLayer) {
    this.circleLayer = new ol.layer.Vector({
      source: this.circleSource,
    });
    this.map.addLayer(this.circleLayer);
  }
}

clickMarker(value) {
  let that = this;
  this.circleColor = '#2E5BFF';
  this.circleRadius = 80;
  this.map.on("singleclick", function (e) {
    this.forEachFeatureAtPixel(e.pixel, function (feature) {
      let flagId = feature.N.employee_msisdn;
      if (feature.N.hasOwnProperty("employee_msisdn") && feature.N.hasOwnProperty("geozone_id") && feature.N.type === value[0].type) {
        let data;
        if (value[0].type === 'geozone') {
          data = value;
        } else {
          data = value.filter(x => x.value.msisdn === flagId);
        }
        that.markerClickEvent.emit(data[0]);
      }
    });
  });

  this.map.on('pointermove', function (e) {
    if (e.dragging) return;
    var pixel = e.map.getEventPixel(e.originalEvent);
    var hit = e.map.forEachFeatureAtPixel(pixel, function () {
      return true;
    });
    e.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
  });
}

// setCircle2(lon, lat, opacity) {
//   var radius = this.circleRadius; //in meter
//   var circle2 = new ol.geom.Circle(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'), radius);
//   console.log(radius, radius);
//   var circleFeature2 = new ol.Feature(circle2);
//   var color = ol.color.asArray(this.circleColor); // convert hex color code to array of rgb
//   console.log(color);
//
//   color[3] = opacity; //set opacity
//   let colorStr = 'rgba(0, 0, 255,' + opacity + ')'
//   console.log(colorStr);
//   // var circleStyle = new ol.style.Style({
//   //     fill: new ol.style.Fill({
//   //         color: color
//   //     })
//   // });
//
//   var circleStyle2 = new ol.style.Style({
//     fill: new ol.style.Fill({
//       color: color
//     })
//   });
//
//
//   circleFeature2.setStyle(circleStyle2);
//
//   this.circleSource2.addFeature(circleFeature2);
//   if (!this.circleLayer2) {
//
//     this.circleLayer2 = new ol.layer.Vector({
//       source: this.circleSource2,
//     });
//     this.map.addLayer(this.circleLayer2);
//   }
// }

addMarker(lon, lat) {
  var iconFeature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857')),
    name: 'Null Island',
    population: 4000,
    rainfall: 500
  });
  this.markerSource.addFeature(iconFeature);
}

trackingIconMarker(lon, lat) {
  this.long = lon;
  this.lat = lat;
  var markerFeature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857')),
    employee_msisdn: this.markedEmployeeMsisdn,
    geozone_id: this.markedGeozone,
    type: this.movementTracker.length > 0 && this.movementTracker[0].hasOwnProperty('type') ? this.movementTracker[0].type : ''
  });
  markerFeature.setStyle(new ol.style.Style({
    image: new ol.style.Icon(({
      crossOrigin: 'anonymous',
      src: this.markedGeozone ? './assets/icons/Icon_Graygeoloc.svg' : './assets/icons/movement_track_user.svg'
    }))
  }));
  this.markerSource.addFeature(markerFeature);
}

// plot movements tracked
plotMovementTrack() {
  var points = []; // array of points to connect between ,\
  this.movementTracker.forEach(el => {
    if (el.hasOwnProperty('value')) {
      if (el.type !== 'geozone') {
        this.markedEmployeeMsisdn = el.value.msisdn;
        this.markedGeozone = null;
      } else {
        this.markedGeozone = el.value.id;
        this.markedEmployeeMsisdn = null;
      }
    }

    this.setCircle(el.lon, el.lat, 0.15); //circle around marker n/a



    this.trackingIconMarker(el.lon, el.lat); //marker //.............

    var start_point = new ol.proj.transform([el.lon, el.lat], 'EPSG:4326', 'EPSG:3857');
    points.push(start_point);
  });
  this.setLines(points);//.........
}

setLines(points) {
  var lineFeature = new ol.Feature(new ol.geom.LineString(points));
  var lineStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: this.circleColor,
      width: 2.5
    })
  });
  lineFeature.setStyle(lineStyle);
  this.lineSource.addFeature(lineFeature);
  if (!this.trackerLayer && !this.clickableMarker) {
    this.trackerLayer = new ol.layer.Vector({
      source: this.lineSource,
    });
    this.map.addLayer(this.trackerLayer);
  }
  console.log("points");
  this.distance = (Math.round(new ol.geom.LineString(points).getLength()));
  this.setCenter();
}


setPointerCursor() {
  this.map.on('pointermove', function (e) {
    e.map.getTargetElement().style.cursor = this ? ' url(\'./assets/icons/blue_pin_fill.svg\') 12 24, auto' : '';
  });
}

  // addLines(coordinateLIST) {
  //   let LIST = [];
  //   coordinateLIST.forEach(element => {
  //     LIST.push(ol.proj.fromLonLat([element['lon'], element['lat']]));
  //   });
  //
  //
  //   var color = ol.color.asArray(this.circleColor);
  //   color[3] = 0.15;
  //   var circleStyle = new ol.style.Style({
  //     fill: new ol.style.Fill({
  //       color: color
  //     })
  //   });
  //
  //   console.log(LIST);
  //   var linie2style = [
  //     new ol.style.Style({
  //       stroke: new ol.style.Stroke({
  //         color: '#2E5BFF',
  //         width: 3
  //       })
  //     })
  //   ];
  //
  //   var linie2 = new ol.layer.Vector({
  //     source: new ol.source.Vector({
  //       features: [new ol.Feature({
  //         geometry: new ol.geom.LineString(LIST),
  //         name: 'Line',
  //       })]
  //     })
  //   });
  //
  //   linie2.setStyle(linie2style);
  //   this.map.addLayer(linie2);
  //   console.log(coordinateLIST);
  //   this.addCircles(coordinateLIST);
  //   //this.iconMarker(coordinateLIST);
  // }

  // addCircles(coordinateLIST) {
  //   for (var i = 0; i < coordinateLIST.length; i++) {
  //     var circle = new ol.geom.Circle(ol.proj.transform([coordinateLIST[i]['lon'], coordinateLIST[i]['lat']], 'EPSG:4326', 'EPSG:3857'), 90);
  //     var circleFeature = new ol.Feature(circle);
  //     var color = ol.color.asArray('#0b6bf2'); // convert hex color code to array of rgb
  //     color[3] = 0.15; //set opacity
  //     var circleStyle = new ol.style.Style({
  //       fill: new ol.style.Fill({
  //         color: color
  //       }),
  //       stroke: new ol.style.Stroke({
  //         color: 'rgba(11, 107, 242, 0.4)',
  //         width: 1
  //       })
  //     });
  //     circleFeature.setStyle(circleStyle);
  //     this.circleSource.addFeature(circleFeature);
  //
  //
  //     var circle2 = new ol.geom.Circle(ol.proj.transform([coordinateLIST[i]['lon'], coordinateLIST[i]['lat']], 'EPSG:4326', 'EPSG:3857'), 39);
  //     var circleFeature2 = new ol.Feature(circle2);
  //     var color2 = ol.color.asArray('#0b6bf2'); // convert hex color code to array of rgb
  //     color2[3] = 0.15; //set opacity
  //     var circleStyle2 = new ol.style.Style({
  //       fill: new ol.style.Fill({
  //         color: color2
  //       }),
  //       stroke: new ol.style.Stroke({
  //         color: 'rgba(11, 107, 242, 1)',
  //         width: 1
  //       })
  //     });
  //     circleFeature2.setStyle(circleStyle2);
  //     this.circleSource2.addFeature(circleFeature2);
  //
  //     if (!this.circleLayer2) {
  //       this.circleLayer2 = new ol.layer.Vector({
  //         source: this.circleSource2,
  //       });
  //       this.map.addLayer(this.circleLayer2);
  //     }
  //     if (!this.circleLayer) {
  //       this.circleLayer = new ol.layer.Vector({
  //         source: this.circleSource,
  //       });
  //       this.map.addLayer(this.circleLayer);
  //     }
  //   }
  //   this.markerSource.clear(); //clear previous marker if exist
  // }
  //
  //
  // iconMarker2(coordinateLIST) {
  //   var iconFeatures = [];
  //   var markerFeature = new ol.Feature({
  //     // geometry: new ol.geom.MultiPoint(ol.proj.transform([lon, lat], 'EPSG:4326','EPSG:3857'))
  //     geometry: new ol.geom.Point(ol.proj.transform([coordinateLIST[0]['lon'], coordinateLIST[0]['lat']], 'EPSG:4326', 'EPSG:3857'))
  //   });
  //   markerFeature.setStyle(new ol.style.Style({
  //     image: new ol.style.Icon(({
  //       crossOrigin: 'anonymous',
  //       src: '/assets/icons/movement_track_user.ico'
  //     }))
  //   }));
  //   this.markerSource.addFeature(markerFeature);
  // };
}
