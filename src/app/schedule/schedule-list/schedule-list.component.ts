import {Component, OnInit, HostListener, ElementRef, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {GetWindowHeightService} from 'src/app/service/get-window-height.service';
import {takeUntil} from 'rxjs/operators';
import {componentDestroyed} from 'src/app/core/takeUntil-function';
import {ScheduleService} from "../service/schedule.service";
import {Schedule} from "../model/schedule.model";
import {Staticdata} from "../StaticData/staticdata.schedule";

@Component({
    selector: 'schedule-list',
    templateUrl: './schedule-list.component.html',
    styleUrls: ['./schedule-list.component.css']
})

export class ScheduleListComponent implements OnInit {
    collection = [];
    scheduleSearchForm: FormGroup;
    laptopSize: boolean = false;
    innerWidth;
    p: number = 1;
    showExpandBtn = true;
    perPageItem = 20;
    totalRows;
    sortingParams;
    loader: boolean = false;
    countRow: number;
    schedules: Schedule[];
    filteredSchedules: Schedule[];
    fieldName: string = "name";
    hoverCheckBox: boolean = false;
    
    @ViewChild('scheduleTable') elementView: ElementRef;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private service: ScheduleService,
        private getWindowHeightService: GetWindowHeightService) {
    }

    ngOnInit() {
        this.initSearchForm();
        this.initSortingParams();
        this.forExpandAndPagination();
        this.adjustWidth();
        this.onDelete();
        setTimeout(() => {
            this.initTable();
        }, 20);
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.adjustWidth();
    }

    initSortingParams(): void {
        this.sortingParams = {
            "order_by": this.fieldName,
            "order_direction": "ASC"
        };
    }


    adjustWidth(): void {
        this.innerWidth = window.innerWidth;
        if (this.innerWidth <= 1100) {
            this.laptopSize = true;
        } else {
            this.laptopSize = false;
        }
    }

    initSearchForm() {
        this.scheduleSearchForm = this.formBuilder.group({
            'scheduleName': ['', Validators.minLength(3)],
            'employeeName': ['', Validators.minLength(3)]
        });

    }

    initTable() {
        let tableHeaderHeight = 42;
        let tableRowsHeight = 73;
        this.getWindowHeightService.getData(this.elementView, tableHeaderHeight, tableRowsHeight, "scheduleTbl");

        this.getWindowHeightService.windowSizeChanged.pipe(takeUntil(componentDestroyed(this))).subscribe(
            value => {
                // this.collection = [];
                this.perPageItem = value.rows;
                this.getScheduleData();
                // this.totalRows = value.rows;
                // console.log(this.totalRows);

                //this number will be used to get data in limit from service
                // if (this.showExpandBtn == false) {
                //     this.perPageItem = this.totalRows;
                //     this.totalRows = 100;
                // }
                //
                // for (let i = 1; i <= this.totalRows; i++) {
                //     this.collection.push(i);
                // }
            }
        );
    }


    getScheduleData(): void {
        let params = {
            "limit": this.perPageItem,
            "page_number": this.p,
            "order_by": this.sortingParams.order_by,
            "order_direction": this.sortingParams.order_direction,
            "filters": this.scheduleSearchForm.value.scheduleName || this.scheduleSearchForm.value.employeeName ?
                (this.scheduleSearchForm.value.scheduleName ?
                    {"name": this.scheduleSearchForm.value.scheduleName} : {"employee_name": this.scheduleSearchForm.value.employeeName}) : {}
        };
        // "filters": this.scheduleSearchForm.valid && this.scheduleSearchForm.value.scheduleName ?
        //     {"name": this.scheduleSearchForm.value.scheduleName} : {}
        this.loader = true;
        this.getSchedules(params);
    }


    getSchedules(params) {
        this.service.getAll(params).pipe(takeUntil(componentDestroyed(this))).subscribe(
            data => {
                if (typeof data === "number") {
                    this.countRow = data;
                    return false;
                }
                this.schedules = data;
                this.filteredSchedules = this.schedules;
                this.loader = false;
            }
        );
    }

    forExpandAndPagination() {
        let params = {
            "limit": 1,
            "page_number": 0,
            "filters": this.scheduleSearchForm.value.scheduleName || this.scheduleSearchForm.value.employeeName ?
                (this.scheduleSearchForm.value.scheduleName ?
                    {"name": this.scheduleSearchForm.value.scheduleName} : {"employee_name": this.scheduleSearchForm.value.employeeName}) : {}
        };
        // "filters": this.scheduleSearchForm.valid && this.scheduleSearchForm.value.scheduleName ?
        //     {"name": this.scheduleSearchForm.value.scheduleName} : {}
        this.getSchedules(params);
    }

    expandTable() {
        this.showExpandBtn = false;
        // this.collection = [];
        // for (let i = 1; i <= 100; i++) {
        //     this.collection.push(i);
        // }
    }

    addNewSchedule() {
        this.router.navigate([Staticdata.CREATEPAGE]);
    }

    editSchedule(id) {
        this.router.navigate([Staticdata.MAINPAGE + id]);

    }

    pageNumber($event): void {
        this.p = $event;
        this.scheduleSearchForm.get("scheduleName").setValue('');
        this.scheduleSearchForm.get("employeeName").setValue('');
        this.getScheduleData();

    }

    sortItems($event): any {
        this.sortingParams = {
            "order_by": $event.order_by,
            "order_direction": $event.order_direction
        };
        this.getScheduleData();
    }

    findSchedule() {
        if (this.scheduleSearchForm.valid) {
            this.forExpandAndPagination();
            this.getScheduleData();
        }
    }

    filterValue($value) {
        if ($value === "") {
            this.forExpandAndPagination();
            this.getScheduleData();
        }
    }

    deleteSchdeule(id) {
        this.router.navigate([Staticdata.MAINPAGE + "/delete/" + id]);

    }


    onDelete(): void {
        this.service.getNotify().pipe(takeUntil(componentDestroyed(this))).subscribe(
            (data) => {
                if (data === true) {
                    this.getScheduleData();
                    this.forExpandAndPagination();
                }
            }
        )
    }


    ngOnDestroy() {
    }
    
    setCheckBoxHover($event) {
        this.hoverCheckBox = $event;
    }
}
