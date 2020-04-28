import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GetWindowHeightService } from 'src/app/service/get-window-height.service';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/core/takeUntil-function';
import { MovementMonitoringService } from './service/movement-monitoring.service';
import { EmployeeService } from 'src/app/employee/service/employee.service';
import { GroupService } from 'src/app/group/service/group.service';
import { DatePipe } from '@angular/common';
import { exportCSV } from 'src/app/core/export';

@Component({
    selector: 'movement-monitoring',
    templateUrl: './movement-monitoring.component.html',
    styleUrls: ['./movement-monitoring.component.css']
})
export class MovementMonitoringComponent implements OnInit {

    movementMonitorForm: FormGroup;
    p: number = 1;
    perPageItem = 20;
    totalRows;
    @ViewChild('reportTable') elementView: ElementRef;
    employees;
    groups;
    sortingParams;
    sortingField: string = "created";
    sortingOrder: string = "ASC";
    loader: boolean = false;
    filteredEvents = [];
    BASEIPURL: string;
    searchBtnDisabled: boolean = false;
    exportBtnDisabled: boolean = false;
    isSubmited: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private getWindowHeightService: GetWindowHeightService,
        private movementMonitoringService: MovementMonitoringService,
        private employeeService: EmployeeService,
        private groupService: GroupService,
        private datePipe: DatePipe
    ) { }

    ngOnInit() {
        this.initForm();
        this.getGroupList();
        this.getEmployeeList();

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

    initForm() {
        const todayYear = Number(this.datePipe.transform(new Date(), 'yyyy'));
        const todayMonth = Number(this.datePipe.transform(new Date(), 'MM'));
        const todayDay = Number(this.datePipe.transform(new Date(), 'dd'));

        this.movementMonitorForm = this.formBuilder.group({
            'fromDate': [{ year: todayYear, month: todayMonth, day: todayDay }, Validators.required],
            'toDate': [{ year: todayYear, month: todayMonth, day: todayDay }, Validators.required],
            'group': [''],
            'employee': ['']
        })
    }

    initSortingParams(): void {
        this.sortingParams = {
            "order_by": this.sortingField,
            "order_direction": this.sortingOrder
        };
    }

    initTable() {
        this.initSortingParams();
        this.countMonitoringData();

        let tableHeaderHeight = 29
        let tableRowsHeight = 73;

        this.getWindowHeightService.getData(this.elementView, tableHeaderHeight, tableRowsHeight, "movementMonitorigReport");

        this.getWindowHeightService.windowSizeChanged.pipe(takeUntil(componentDestroyed(this))).subscribe(
            value => {
                this.perPageItem = value.rows;
                this.getMonitoringData();
            }
        );
    }

    countMonitoringData() {
        let params = {};
        let filterParams = this.getFilterParams();

        if (filterParams != null) {
            params = this.getFilterParams();
        }

        params['limit'] = 1;
        params['page_number'] = 0;

        this.getMovementList(params);
    }

    getMonitoringData() {
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
        this.getMovementList(params);
    }

    getMovementList(params) {
        this.movementMonitoringService.getAll(params).pipe(takeUntil(componentDestroyed(this))).subscribe(data => {
            if (typeof data === "number") {
                this.totalRows = data;
                return true;
            }
            this.filteredEvents = data;
            this.loader = false;
            this.searchBtnDisabled = false;
        }, error => console.log(error));

    }

    pageChanged(pageNumber): void {
        this.p = pageNumber;
        this.getMonitoringData();
    }

    sortItems($event): any {
        this.sortingParams = {
            "order_by": $event.order_by,
            "order_direction": $event.order_direction
        };
        this.getMonitoringData();
    }
    searchMonitoringData() {
        this.isSubmited = true;
        if (this.movementMonitorForm.valid) {
            this.searchBtnDisabled = true;
            this.countMonitoringData();
            this.getMonitoringData();
        }
    }

    getFilterParams() {
        let filterParams = {};

        filterParams['date_from'] = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
        filterParams['date_to'] = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");

        if (this.movementMonitorForm.valid) {

            if (this.movementMonitorForm.value.group != "" && this.movementMonitorForm.value.employee == "") {
                filterParams["group_id"] = this.movementMonitorForm.value.group;
            }

            if (this.movementMonitorForm.value.employee != "") {
                filterParams["employee_id"] = this.movementMonitorForm.value.employee;
            }

            if (this.movementMonitorForm.value.fromDate != "") {
                let fromDateObj = this.movementMonitorForm.value.fromDate;
                filterParams["date_from"] = this.datePipe.transform(new Date(fromDateObj['year'], fromDateObj['month'] - 1, fromDateObj['day']), "yyyy-MM-dd HH:mm:ss");
            }

            if (this.movementMonitorForm.value.toDate != "") {
                let toDateObj = this.movementMonitorForm.value.toDate;
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
        //exportCSV('MovementsMonitoring.csv', this.filteredEvents);
        //this.exportBtnDisabled = false;
            console.log(params);
        this.movementMonitoringService.getAll(params).pipe(takeUntil(componentDestroyed(this))).subscribe(data => {
            console.log(data);
            exportCSV('MovementsMonitoring.csv', data);
            this.exportBtnDisabled = false;
        }, error => console.log(error));
    }

    ngOnDestroy(): void {
    }

    private errorImage = false;
    errorImgHandler(event) {
        event.target.src = "assets/icons/blue_user.svg";
        event.target.classList.add("img-error");
    }

    groupChanged(data) {
        if (data != "") {
            this.movementMonitorForm.controls['employee'].setValue("");
            this.getEmployeeList(data);
        } else {
            this.getEmployeeList();
        }
    }

    employeeChanged(data) {
        if (data != "") {
            //            this.movementMonitorForm.controls['group'].setValue("");
        }
    }
}
