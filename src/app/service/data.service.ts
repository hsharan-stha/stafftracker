import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TA_Employee } from 'src/app/models/TA_Employee';
import { BehaviorSubject } from 'rxjs';
import { AppConfigService } from './AppConfig.service';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(
        private http: HttpClient,
        private appConfigService: AppConfigService
    ) {
    }

    private data = {};

    setOption(option, value) {
        this.data[option] = value;
    }

    getOption(data = null) {
        if (data != null) {
            return this.data[data];
        }
        return this.data;
    }

    public getTAEmployeeJSON(): Observable<TA_Employee[]> {

        return this.http.get<TA_Employee[]>('./assets/sample-data/employee.json');

    }
    

    public getTAGroupJSON(): Observable<TA_Employee[]> {

        return this.http.get<TA_Employee[]>('./assets/sample-data/group.json');

    }

    public getTAGeozoneJSON(): Observable<TA_Employee[]> {

        return this.http.get<TA_Employee[]>('./assets/sample-data/geozone.json');

    }


    dashboardDataSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
    dashboardData = this.dashboardDataSource.asObservable();

    updateDashboardData(data) {
        this.dashboardDataSource.next(data);
    }
}
