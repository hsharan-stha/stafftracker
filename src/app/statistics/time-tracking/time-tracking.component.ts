import { Component, ElementRef, HostListener, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GetWindowHeightService } from 'src/app/service/get-window-height.service';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/core/takeUntil-function';
import { TimeTrackingService } from './service/time-tracking.service';
import { EmployeeService } from 'src/app/employee/service/employee.service';
import { GroupService } from 'src/app/group/service/group.service';
import { DatePipe } from '@angular/common';
import { exportCSV } from 'src/app/core/export';
import { TimeTrackingCsvModel } from './model/time-trackingCsv.model';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'time-tracking',
    templateUrl: './time-tracking.component.html',
    styleUrls: ['./time-tracking.component.css']
})
export class TimeTrackingComponent implements OnInit {
    timeTrackingSearchForm: FormGroup;
    mainForm

    p: number = 1;
    filteredEvents = [];
    showExpandBtn = true;
    perPageItem = 20;
    totalRows;
    elementView
    @ViewChild('reportTable') elementViewRef: ElementRef;
    employees;
    groups;
    sortingParams;
    sortingField: string = "name";
    sortingOrder: string = "ASC";
    BASEIPURL;
    searchBtnDisabled: boolean = false;
    exportBtnDisabled: boolean = false;
    isSubmited: boolean = false;
    loader: boolean = false;


    constructor(
        private formBuilder: FormBuilder,
        private getWindowHeightService: GetWindowHeightService,
        private renderer: Renderer2,
        private employeeService: EmployeeService,
        private groupService: GroupService,
        private datePipe: DatePipe,
        private timeTrackingService: TimeTrackingService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.elementView = this.renderer.selectRootElement(this.elementViewRef);
        this.initSearchForm();

        this.employees = this.route.snapshot.data.employee_all;
        console.log('sssss');
        console.log('sssss');
        console.log('sssss');
        this.groups = this.route.snapshot.data.group_all;
        console.log(this.route.snapshot.data);
        setTimeout(() => {
            this.initTable();
        }, 20);
        this.BASEIPURL = this.employeeService.getBaseIPURL();
    }

    getEmployeeList(group_id = null) {
        let tableParam = {
            "page_number": 1,
            "order_by": 'name',
            "order_direction": "ASC"
        };
        if (group_id != null) {
            tableParam["filters"] = {
                "group_id": group_id
            };
        }
        this.employeeService.getEmployees(tableParam).pipe(takeUntil(componentDestroyed(this))).subscribe(
            data => {
                this.employees = data;
                console.log(data);
            },
            error => {
                this.employees = [];
                console.log(error);
            });
    }

    getGroupList() {
        let tableParam = {
            "page_number": 1,
            "order_by": 'name',
            "order_direction": "ASC"
        };
        this.groupService.getAll(tableParam).pipe(takeUntil(componentDestroyed(this))).subscribe(
            data => {
                this.groups = data;
                console.log(data);
            },
            error => {
                console.log(error);
            });
        
    }

    initSearchForm() {
        const todayYear = Number(this.datePipe.transform(new Date(), 'yyyy'));
        const todayMonth = Number(this.datePipe.transform(new Date(), 'MM'));
        const todayDay = Number(this.datePipe.transform(new Date(), 'dd'));

        this.timeTrackingSearchForm = this.formBuilder.group({
            'fromDate': [{ year: todayYear, month: todayMonth, day: todayDay }, Validators.required],
            'toDate': [{ year: todayYear, month: todayMonth, day: todayDay }, Validators.required],
            'group': [''],
            'employee': ['']
        });
    }

    initTable() {
        this.initSortingParams();
        this.countTrackingData();

        let tableHeaderHeight = 36;
        let tableRowsHeight = 73;
        let secondTableRowHeight = 113;

        this.getWindowHeightService.getData(this.elementView, tableHeaderHeight, tableRowsHeight, "timeTrackingReport", secondTableRowHeight);

        this.getWindowHeightService.windowSizeChanged.pipe(takeUntil(componentDestroyed(this))).subscribe(
            value => {
                this.perPageItem = value.rows;
                this.getTrackingData();
            }
        );
    }

    ngOnDestroy(): void {
    }


    initSortingParams(): void {
        this.sortingParams = {
            "order_by": this.sortingField,
            "order_direction": this.sortingOrder
        };
    }

    countTrackingData() {
        let params = {};
        let filterParams = this.getFilterParams();

        if (filterParams != null) {
            params = this.getFilterParams();
        }

        params['limit'] = 1;
        params['page_number'] = 0;

        this.getTrackingList(params);
    }

    getTrackingData() {
        let params = {};
        let filterParams = this.getFilterParams();
        if (filterParams != null) {
            params = this.getFilterParams();
        }
        params['limit'] = this.perPageItem;
        params['page_number'] = this.p;
        params['order_by'] = this.sortingParams.order_by;
        params['order_direction'] = this.sortingParams.order_direction;

        this.loader = true;
        this.getTrackingList(params);
    }

    getTrackingList(params) {
        this.timeTrackingService.getAll(params).pipe(takeUntil(componentDestroyed(this))).subscribe(data => {
            if (typeof data === "number") {
                this.totalRows = data;
                return true;
            }
            console.log(data);
            this.filteredEvents = data;
            this.loader = false;
            this.searchBtnDisabled = false;
        }, error => console.log(error));

    }

    pageChanged(pageNumber): void {
        this.p = pageNumber;
        this.getTrackingData();
    }

    sortItems($event): any {
        this.sortingParams = {
            "order_by": $event.order_by,
            "order_direction": $event.order_direction
        };
        this.getTrackingData();
    }
    searchMonitoringData() {
        this.isSubmited = true;
        if (this.timeTrackingSearchForm.valid) {
            this.searchBtnDisabled = true;
            this.countTrackingData();
            this.getTrackingData();
        }
    }

    getFilterParams() {
        let filterParams = {};

        filterParams['date_from'] = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
        filterParams['date_to'] = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");

        if (this.timeTrackingSearchForm.valid) {

            if (this.timeTrackingSearchForm.value.group != "" && this.timeTrackingSearchForm.value.employee == "") {
                filterParams["group_id"] = this.timeTrackingSearchForm.value.group;
            }

            if (this.timeTrackingSearchForm.value.employee != "") {
                filterParams["employee_id"] = this.timeTrackingSearchForm.value.employee;
            }

            if (this.timeTrackingSearchForm.value.fromDate != "") {
                let fromDateObj = this.timeTrackingSearchForm.value.fromDate;
                filterParams["date_from"] = this.datePipe.transform(new Date(fromDateObj['year'], fromDateObj['month'] - 1, fromDateObj['day']), "yyyy-MM-dd HH:mm:ss");
            }

            if (this.timeTrackingSearchForm.value.toDate != "") {
                let toDateObj = this.timeTrackingSearchForm.value.toDate;
                filterParams["date_to"] = this.datePipe.transform(new Date(toDateObj['year'], toDateObj['month'] - 1, toDateObj['day']), "yyyy-MM-dd HH:mm:ss");
            }
        }
        return filterParams;
    }


    exportData() {
        this.exportBtnDisabled = true;
        let params = {};
        let filterParams = this.getFilterParams();

        if (filterParams != null) {
            params = this.getFilterParams();
        }

        params['for_export'] = 1;
        //params['page_number'] = 1;

        this.timeTrackingService.getAll(params).pipe(takeUntil(componentDestroyed(this))).subscribe(data => {
            console.log(data);
            //exportCSV('TimeTrackingReport.csv', this.filteredEvents);
            this.generateCsv(data);
            this.exportBtnDisabled = false;
        }, error => console.log(error));
    }


    private errorImage = false;
    errorImgHandler(event) {
        event.target.src = "assets/icons/blue_user.svg";
        event.target.classList.add("img-error");
    }

    errorGrpImgHandler(event) {
        event.target.src = "assets/icons/operators.png";
        event.target.classList.add("img-error");
    }

    groupChanged(data) {
        if (data != "") {
            this.timeTrackingSearchForm.controls['employee'].setValue("");
            this.getEmployeeList(data);
        } else {
            this.getEmployeeList();
        }
    }
    employeeChanged(data) {

    }



    generateCsv(data) {
        // data = [...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data,...data];
        let DATALIST = [];
        for (let i = 0; i < data.length; i++) {
            console.log(data[i]);
            // console.log(data[i]['summary']);
            let printFirstRowi = true;
            //for (var k in data[i]['summary'])keys.push(k);
            for (let k in data[i]['summary']) {
                console.log(data[i]['name']);
                console.log(k);
                console.log(data[i]['summary'][k]);
                let tempObj;
                if(printFirstRowi){
                    tempObj = new TimeTrackingCsvModel(data[i]['name'], data[i]['position'], data[i]['group'], data[i]['hours_worked'], data[i]['absent_time'], data[i]['lateness'], k, data[i]['summary'][k]);
                    printFirstRowi = false;
                }
                else{
                    tempObj = new TimeTrackingCsvModel(data[i]['name'], data[i]['position'], data[i]['group'], '', '', '', k, data[i]['summary'][k]);
                }
                DATALIST.push(tempObj)
            };

            // for (let j = 0; j < keys.length; j++) {
            //     console.log(keys[j],':::::::::::' , data[i]['summary'][keys[j]]);
            // }
        }
        exportCSV('TimeTrackingReport.csv', DATALIST);
    }

}
