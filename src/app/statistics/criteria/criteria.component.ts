import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'criteria',
    templateUrl: './criteria.component.html',
    styleUrls: ['./criteria.component.css']
})
export class CriteriaComponent implements OnInit {

    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    movementMonitoring() {
        this.router.navigate(['main/statistics/movement-monitoring']);
    }

    controlGeozoneVisits() {
        this.router.navigate(['main/statistics/geozone-visits']);
    }

    employeeDataReport() {
        this.router.navigate(['main/statistics/employee-data']);
    }

    timeTrackingReport() {
        this.router.navigate(['main/statistics/time-tracking']);
    }

    movementTrackingReport() {
        this.router.navigate(['main/statistics/track-movements']);
    }

    notificationExplanatoryReport() {
        this.router.navigate(['main/statistics/notification-explanatory']);

    }

}
