import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommService } from '../../shared/map/services/comm.service';
import { GeoLocationService } from 'src/app/service/geo-location.service';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/core/takeUntil-function';
import { AlertMessageService } from 'src/app/service/alert-message.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'track-movements',
    templateUrl: './track-movements.component.html',
    styleUrls: ['./track-movements.component.css']
})
export class TrackMovementsComponent implements OnInit {
    coordinateLists = [];
    trackMovementForm: FormGroup;
    trackedMovements: Boolean = false;
    showMovementDetails: Boolean = false;
    mapLoader: boolean = false;
    innerWidth;
    isMapShow: boolean = false;
    mapHeight;
    @ViewChild('mapWrapper') mapWrapperView: ElementRef;
    showActivityMap: boolean = true;

    movementLists = [
        { event: 'Event One', time: '8:01', lon: 28.826699405908585, lat: 47.01862953101329 },
        { event: 'Event Two', time: '10:01', lon: 28.82610931992531, lat: 47.02105788876918 },
        { event: 'New York', time: '1:01', lon: 28.828201442956924, lat: 47.019668179474195 },
        { event: 'California', time: '2:01', lon: 28.829617649316784, lat: 47.02064829399967 },
        { event: 'Event Five', time: '3:01', lon: 28.830937296152115, lat: 47.021577191905834 },
        { event: 'Event Six', time: '4:01', lon: 28.832407146692272, lat: 47.020633665556915 },
        { event: 'Event Seven', time: '5:01', lon: 28.83376970887184, lat: 47.019704751234826 },
        { event: 'At Nepal', time: '6:01', lon: 28.832353502511975, lat: 47.01876850627397 },
        { event: 'At Nepal', time: '6:01', lon: 28.932353502511975, lat: 48.01876850627397 }
    ]
    coordinateList = [];

    constructor(
        private formBuilder: FormBuilder,
        private commService: CommService,
        public geoLocation: GeoLocationService,
        public alertService: AlertMessageService,
        public datePipe: DatePipe
    ) {
    }
    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.getHeightOfMap();
    }
    ngOnInit() {
        this.initForm();
        this.commService.setLatLongCenter(this.movementLists[0]['lat'], this.movementLists[0]['lon'])
        this.movementLists.forEach((item) => {
            this.coordinateList.push({ lat: item['lat'], lon: item['lon'] });
        });
        setTimeout(() => {
            this.getHeightOfMap();
        }, 20);
    }

    initForm() {
        const todayYear = Number(this.datePipe.transform(new Date(), 'yyyy'));
        const todayMonth = Number(this.datePipe.transform(new Date(), 'MM'));
        const todayDay = Number(this.datePipe.transform(new Date(), 'dd'));
        this.trackMovementForm = this.formBuilder.group({
            'employee': ['', Validators.required],
            'date': [{ year: todayYear, month: todayMonth, day: todayDay }, Validators.required],
        })
    }

    getTrackedMovements() {
        // this.coordinateLists = [];
        if (this.trackMovementForm.valid) {
            // this.isvalid = "yes";
            let employee = this.trackMovementForm.value.employee;
            let date = this.trackMovementForm.value.date;
            let params = {
                "msisdn": employee[0].msisdn,
                "start_date": date.year + "-" + date.month + "-" + date.day
            };
            this.trackedLocation(params);
        } else {
            //  this.isvalid = "no";
            console.log("invalid form");
        }
    }

    trackedLocation(params) {
        this.mapLoader = true;
        this.commService.setCircleRadius(80);
        this.commService.setColorCode('#2E5BFF');
        this.geoLocation.getPeriodicLocation(params).pipe(takeUntil(componentDestroyed(this))).subscribe(res => {
            this.coordinateLists = res;
            this.movementLists = res;
            this.trackedMovements = true;
        }, err => {
            this.error(err);
        }, () => {
            this.setMarkerOnMap();
            this.mapLoader = false;
        });
    }
    error(err): void {
        this.alertService.show({
            message: err.error.result,
            alertType: "error"
        });
        this.mapLoader = false;
        this.movementLists = [];
        this.trackedMovements = false;
    }
    // getTrackedMovements() {
    //     this.trackedMovements = true;
    //     this.commService.setMovementList(this.movementLists);
    //     if (this.trackMovementForm.valid) {
    //         let employee = this.trackMovementForm.value.employee;
    //         let date = this.trackMovementForm.value.date;

    //         console.log(this.trackMovementForm.value);
    //     } else {
    //         console.log("invalid form");
    //     }
    // }

    exportData() {
        console.log("Export data");
    }
    setMarkerOnMap() {
        this.commService.setMovementList(this.coordinateLists);
    }
    ngOnDestroy() {

    }
    getHeightOfMap() {
        this.innerWidth = window.innerWidth;
        
        this.isMapShow = false;
        this.trackedMovements = false;
        let mapTopPosition = this.mapWrapperView.nativeElement.getBoundingClientRect().top;
        let windowHeight = window.innerHeight;
        
        let marginBtmSpace = 20;
        let searchBarHeight = 50;
        let requiredHeight = (windowHeight - mapTopPosition - marginBtmSpace - searchBarHeight - 5);
        // if (requiredHeight > 579) {
        requiredHeight = requiredHeight - 25;
        console.log(requiredHeight);
        // }
        this.mapHeight = (requiredHeight > 180) ? requiredHeight + 'px' : 180 + 'px';
        setTimeout(() => {
            this.isMapShow = true;
        }, 20);
    }
}
//