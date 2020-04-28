import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { GetWindowHeightService } from 'src/app/service/get-window-height.service';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/core/takeUntil-function';
import { NotificationsExplanatoryNotesService } from './notifications-explanatory-notes-service/notifications-explanatory-notes.service';
import { exportCSV } from 'src/app/core/export';
import { formatDate } from '@shared/format-date';
import { DatePipe } from '@angular/common';
import { GroupService } from 'src/app/group/service/group.service';
import { AppConfigService } from 'src/app/service/AppConfig.service';
import { EmployeeService } from 'src/app/employee/service/employee.service';
import { isNumber } from '@shared/checkIsNumber';
import { createTemplateData } from '@angular/core/src/view/refs';
import { NotificationAndExplanatoryCsVModel } from './adapter/NotificationAndExplanatory.adapter';

@Component({
    selector: 'notifications-explanatory-notes',
    templateUrl: './notifications-explanatory-notes.component.html',
    styleUrls: ['./notifications-explanatory-notes.component.css']
})
export class NotificationsExplanatoryNotesComponent implements OnInit {
    msisdn;
    searchForm: FormGroup;
    notificationAndExplanatoryForm: FormGroup;
    p: number = 1;
    perPageItem = 20;
    totalRows;
    @ViewChild('reportTable') elementView: ElementRef;
    groups = [];
    employees = [];
    NotificationAndExplanatory = [
        // {
        //     id: 1,
        //     emp_id: 6,
        //     name: 'Bebop',
        //     position: 'position',
        //     groupname: 'Name test',
        //     groupposition: 'position',
        //     message: 'message text. this, is for test this is for, test this is for test, this is for tets',
        //     date: '08/21/2019',
        //     time: '08:02:01',
        //     direction: 1,
        //     critical: 1
        // },
        // {
        //     id: 2,
        //     emp_id: 1,
        //     name: 'John Cena',
        //     position: 'Wrestler',
        //     groupname: 'Name test',
        //     groupposition: 'position',
        //     message: 'message text. this is for test this is for test this is for test this is for tets',
        //     date: '08/21/2019',
        //     time: '08:02:01',
        //     direction: 0,
        //     critical: 0
        // }
    ];

    filteredEvents = this.NotificationAndExplanatory;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private getWindowHeightService: GetWindowHeightService,
        private notiExpNoteService: NotificationsExplanatoryNotesService,
        private datePipe: DatePipe,
        private groupService: GroupService,
        private appConfigService: AppConfigService,
        private employeeService: EmployeeService
    ) { }

    ngOnInit() {
        this.initForm();
        this.getGroupList();
        this.notiExpNoteService.getData({
            "date_from": "1900-07-29 00:00:00",
            "date_to": formatDate(new Date().toISOString()),
            "msisdn": 661212121,
            "page_number": 1,
            "limit": 1
        })
            .subscribe(
                data => console.log(data),
                err => [],
                () => {
                    setTimeout(() => {
                        this.initTable();
                    }, 10);
                }
            )
        console.log(this.NotificationAndExplanatory[0]);

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
        console.log({ year: todayYear, month: todayMonth, day: todayDay }); //{year: 2019, month: 8, day: 13}

        this.notificationAndExplanatoryForm = this.formBuilder.group({
            'fromDate': [{ year: todayYear, month: todayMonth, day: todayDay }],
            'toDate': [{ year: todayYear, month: todayMonth, day: todayDay }],
            'group': [''],
            'notificationAndExplanatory': [''],
            'employee': ['', Validators.required]
        })
        this.getNotificationAndExplanatoryList();
    }

    initTable() {
        let tableHeaderHeight = 29
        let tableRowsHeight = 73;
        let secondTableRowHeight = 104;
        this.getWindowHeightService.getData(this.elementView, tableHeaderHeight, tableRowsHeight, "notificationExReport", secondTableRowHeight);

        this.getWindowHeightService.windowSizeChanged.pipe(takeUntil(componentDestroyed(this))).subscribe(
            value => {
                this.perPageItem = value.rows;
                this.totalRows = this.filteredEvents.length;
            }
        );
    }

    getNotificationAndExplanatoryList() {
        console.log(this.f);
        console.log(this.f.fromDate.value);
        console.log(this.f.employee.value);
        let fromDate;
        let toDate;
        if (this.f.fromDate.value) {
            fromDate = new Date(this.f.fromDate.value.year + '-' + this.f.fromDate.value.month + '-' + this.f.fromDate.value.day + ' ' + '00:00:00').toISOString();
        } else {
            fromDate = new Date('1990-01-01 00:00:00').toISOString();
        }
        if (this.f.toDate.value) {
            toDate = new Date(this.f.toDate.value.year + '-' + this.f.toDate.value.month + '-' + this.f.toDate.value.day + ' ' + '23:59:59').toISOString();
        } else {
            toDate = formatDate(new Date().toISOString())
        }
        console.log(formatDate(fromDate));
        console.log(formatDate(toDate));
        this.notiExpNoteService.getData({
            "date_from": formatDate(fromDate),
            "date_to": formatDate(toDate),
            "msisdn": this.msisdn, //661212121
            "page_number": 1,
            "limit": 1
        })
            .subscribe(
                data => {
                    console.log(data[0]);
                    this.filteredEvents = data;
                }
            )
    }


    exportData() {
        let fromDate;
        let toDate;
        if (this.f.fromDate.value) {
            fromDate = new Date(this.f.fromDate.value.year + '-' + this.f.fromDate.value.month + '-' + this.f.fromDate.value.day + ' ' + '00:00:00').toISOString();
        } else {
            fromDate = new Date('1990-01-01 00:00:00').toISOString();
        }
        if (this.f.toDate.value) {
            toDate = new Date(this.f.toDate.value.year + '-' + this.f.toDate.value.month + '-' + this.f.toDate.value.day + ' ' + '23:59:59').toISOString();
        } else {
            toDate = formatDate(new Date().toISOString())
        }
        console.log(formatDate(fromDate));
        console.log(formatDate(toDate));
        this.notiExpNoteService.getData({
            "date_from": formatDate(fromDate),
            "date_to": formatDate(toDate),
            "msisdn": this.msisdn, //661212121
            "page_number": 1,
            "limit": 100
            //"for_export": 1, //661212121
        })
            .subscribe(
                data => {
                    console.log(data);
                    this.generateCSV(data);
                    
                }
            )
       

    }

    employeeEvents;
    ngOnDestroy(): void {
    }
    get f() {
        return this.notificationAndExplanatoryForm.controls;
    }
    imageURL(): string {
        return this.appConfigService.config['base_ip'];
    }
    onRemove() {
        this.msisdn = null;
    }
    ddEmpChanged(data) {
        console.log(isNumber(data['name']));
        if (data == "") {
            this.msisdn = null;
        }
        else if (isNumber(data['name'])) {
            console.log('setValue', data['name']);
            this.msisdn = data['name'];
            // this.f.employee.setValue(data['name']);
        }
        else if (!isNumber(data['name'])) {
            console.log('setValue', data['msisdn']);
            this.msisdn = data['msisdn'];
            // this.f.employee.setValue(data['msisdn']);
        }
        console.log(this.msisdn);
    }



    groupChanged(data) {

        if (data != "") {
            //this.notificationAndExplanatoryForm.controls['employee'].setValue("");
            this.getEmployeeList(data);
        } else {
            this.getEmployeeList();
        }
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
                console.log(error);
            });
    }
    generateCSV(data){
        let TEMPDATA = [];

        let fromDateStr = this.f.fromDate.value.year + '-' + this.f.fromDate.value.month + '-' + this.f.fromDate.value.day;
        let toDateStr = this.f.toDate.value.year + '-' + this.f.toDate.value.month + '-' + this.f.toDate.value.day;
        for(let i = 0; i <data.length;i++){
            console.log(data[i]);
            TEMPDATA.push(new NotificationAndExplanatoryCsVModel(fromDateStr + ' ' + toDateStr+ ' ' + data[i].name, data[i].position,data[i].groupname,data[i].groupposition,data[i].message,data[i].date,data[i].time,data[i].direction,data[i].critical));
        }

        exportCSV('NotificationAndExplanatory.csv', TEMPDATA);
    }
}

// 