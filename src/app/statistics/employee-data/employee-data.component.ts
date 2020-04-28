import { Component, OnInit, ElementRef, HostListener, ViewChild, Renderer2 } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { GoogleChartComponent } from 'ng2-google-charts';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/core/takeUntil-function';
import { EmployeeDataService } from './service/employee-data.service';
import { DatePipe } from '@angular/common';
import { exportCSV } from 'src/app/core/export';
import { EmployeeService } from 'src/app/employee/service/employee.service';
import { EmployeeDataCsvModel } from './adapter/EmployeeDatacsv.model';
import { formatDate } from '@shared/format-date';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'employee-data',
    templateUrl: './employee-data.component.html',
    styleUrls: ['./employee-data.component.css']
})
export class EmployeeDataComponent implements OnInit {
    infoMessage: { item: any, value: any } = { item: "", value: "" };
    mainForm;
    @ViewChild("mainform") mainFormRef: ElementRef;
    employees;
    employeeData;
    searchBtnDisabled: boolean = false;
    exportBtnDisabled: boolean = false;
    isSubmited: boolean = false;
    loader: boolean = false;
    showLegendPieChart: boolean = false;
    selectedEmployee: string;
    totalPieRows: number = 0;
    totalColRows: number = 0;
    constructor(
        private formBuilder: FormBuilder,
        private renderer: Renderer2,
        private employeeDataService: EmployeeDataService,
        private datePipe: DatePipe,
        private employeeService: EmployeeService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.mainForm = this.renderer.selectRootElement(this.mainFormRef);
        this.initSearchForm();
        this.getEmployeeList();
        this.adjustForm(this.getWindowWidth());
        console.log(this.route.snapshot.data);
    }

    //CONFIGURATION FOR THE BAR CHART START HERE
    public columnChart: GoogleChartInterface = {
        chartType: 'ColumnChart',
        dataTable: [
            ['weekday', 'Work day', 'The employee has worked', 'Overwork', 'Not completed'],
            ["Sun", 8, 1, 0, 7],
            ["Mon", 8, 8, 2, ""],
            ["Tue", 8, 7, 0, 1],
            ["Wed", 8, 3, 0, 6],
            ["Thu", 8, 5, 0, 3],
            ["Fri", 8, 1, 0, 7],
            ["Sat", 8, 8, 8, ""]
        ],
        options: {
            hAxis: {
                textStyle: { color: '#B0BAC9', fontSize: 15, fontFamily: "Rubik" },
                baselineColor: "#E0E7FF",
                baseline: 1,
                gridlines: { color: '#333' }
            },
            vAxis: {
                minValue: 0,
                textStyle: { color: '#B0BAC9', fontSize: 15, fontFamily: "Rubik" },
                baselineColor: "#E0E7FF",
                gridlines: { color: "#E0E7FF" }
            },
            isStacked: true,
            series: {
                0: { type: 'line', color: "#F7C137" },
                1: { color: "#2E5BFF" },
                2: { color: "#33AC2E" },
                3: { color: "#D63649" },
            },
            legend: {
                position: 'top',
                textStyle: {
                    color: '#8798AD',
                    fontSize: 15,
                    fontFamily: "Rubik"
                },
                maxLines: 3,
                alignment: "center"
            },
            bar: {
                groupWidth: 7
            },
            chartArea: {
                left: 50,
                top: 60,
                width: '100%',
                height: '70%'
            },
            height: 350
        }
    }
    barWidth = 700;
    barHeight = 400;
    //CONFIGURATION FOR BAR CHART END HEARE

    dataTableDATA = [
        ['Task', 'Hours per Day'],
        ['Days without violations', 6],
        ['Violations of the working schedule', 4],
        ['Number of delays', 2],
        ['Absences at the end of the day', 8]
    ];
    dataTableCOLORS = {
        0: { color: "#2E5BFF" },
        1: { color: "#8C54FF" },
        2: { color: "#00C1D4" },
        3: { color: "#FAD050" }
    };
    //CONFIGURATION FOR PIE CHART START HERE
    public pieChart: GoogleChartInterface = {
        chartType: 'PieChart',
        dataTable: this.dataTableDATA,
        //opt_firstRowIsData: true,
        options: {
            pieHole: 0.8,
            legend: {
                position: 'none',
                alignment: '',
                orientation: 'vertical',
                textStyle: {
                    color: '#8798AD',
                    fontSize: 15,
                    fontFamily: "Rubik"
                },
                maxLines: 4,
            },
            pieSliceBorderColor: "",
            pieSliceText: "none",
            slices: this.dataTableCOLORS,
            chartArea: {
                left: 0,
                top: 50,
                width: '105%',
                height: '57%'
            },
            height: 350,
            'tooltip': {
                trigger: 'none'
            },
            hAxis: {
                direction: -1,
                slantedText: true,
            }
        },
    };

    donutWidth = 400;
    donumtHeight = 500;
    //CONFIGURATION FOR PIE CHART END HERE

    //to redrawing the chart on resizing the window
    @ViewChild('pieChartView') pieChartView: GoogleChartComponent;
    @ViewChild('columnChartView') columnChartView: GoogleChartComponent;

    @HostListener('window:resize', ['$event'])
    onWindowResize(event: any) {
        let innerWidth = this.getWindowWidth();
        this.adjustForm(innerWidth);

        if (this.totalPieRows > 0) {
            let selection = this.pieChartView.wrapper.visualization.getSelection();
            this.pieChartView.draw();
            this.pieChartView.wrapper.visualization.setSelection(selection);
        }

        if (this.totalColRows > 0) {
            let selectionColumn = this.columnChartView.wrapper.visualization.getSelection();
            this.columnChartView.draw();
            this.columnChartView.wrapper.visualization.setSelection(selectionColumn);
        }
    }

    adjustForm(innerWidth) {
        if (innerWidth <= 1155) {
            let elements = this.mainForm.nativeElement.querySelectorAll('.col-lg-3');
            elements.forEach(function (value, index) {
                console.log(value, index);
                value.classList.remove('col-lg-3');
                if (index === 3)
                    value.classList.add('col-lg-12')
                else
                    value.classList.add('col-lg-4');

            });
            // elements[0].classList.remove('active-employee-info');
            // event.target.classList.add('active-employee-info');
        } else if (innerWidth > 1155) {
            let elements = this.mainForm.nativeElement.querySelectorAll('.col-lg-4');
            let elementButton = this.mainForm.nativeElement.querySelectorAll('.col-lg-12');
            elements.forEach(function (value, index) {
                value.classList.remove('col-lg-4');
                value.classList.add('col-lg-3');
            });
            if (elementButton.length > 0) {
                elementButton[0].classList.remove('col-lg-12');
                elementButton[0].classList.add('col-lg-3');
            }
        }

    }

    ddEmpChanged(data) {
        let tableParam = {
            "limit": 1,
            "page_number": 1,
            "filters": {
                "msisdn": data
            }
        };
        this.employeeService.getEmployees(tableParam).pipe(takeUntil(componentDestroyed(this))).subscribe(
            data => {
                this.selectedEmployee = data[0].name;
            },
            error => {
                console.log(error);
            });

    }

    empDataSearchForm: FormGroup;

    initSearchForm() {
        const todayYear = Number(this.datePipe.transform(new Date(), 'yyyy'));
        const todayMonth = Number(this.datePipe.transform(new Date(), 'MM'));
        const todayDay = Number(this.datePipe.transform(new Date(), 'dd'));

        this.empDataSearchForm = this.formBuilder.group({
            'fromDate': [{ year: todayYear, month: todayMonth, day: todayDay }, Validators.required],
            'toDate': [{ year: todayYear, month: todayMonth, day: todayDay }, Validators.required],
            'employee': ['', Validators.required]
        });

    }

    onMouseOver(e) {

        console.log(e, e['value'], e['position']['row']);
        console.log(this.dataTableDATA[e['position']['row'] + 1][1]);
        this.infoMessage = {
            item: e['value'],
            value: this.dataTableDATA[e['position']['row'] + 1][1]
        };
    }

    chartSelect(e) {
        console.log(e);
    }

    getDotColor(i) {
        return { 'background-color': this.dataTableCOLORS[i]['color'] };
    }

    getWindowWidth(): number {
        return window.innerWidth;
    }

    ngOnDestroy(): void {
        this.employeeData = null;
        }


    getEmployeeList() {
        let tableParam = {
            "page_number": 1,
            "order_by": 'name',
            "order_direction": "ASC"
        };
        this.employeeService.getEmployees(tableParam).pipe(takeUntil(componentDestroyed(this))).subscribe(
            data => {
                this.employees = data;
                console.log(data);
            },
            error => {
                console.log(error);
            });
    }



    getEmployeeDataList() {
        let params = {};
        let filterParams = this.getFilterParams();
        if (filterParams != null) {
            params = this.getFilterParams();
        }
        this.loader = true;

        this.employeeDataService.getAll(params).pipe(takeUntil(componentDestroyed(this))).subscribe(data => {
            console.log('employeeDataemployeeDataemployeeDataemployeeDataemployeeData',data);
            this.employeeData = data;

            this.updatePieChart(data);
            if (typeof data.summary != "undefined" && data.summary.length > 0) {
                this.updateColumnChart(data);
                this.totalColRows = 1;
            } else {
                this.totalColRows = 0;
            }

            this.loader = false;
            this.searchBtnDisabled = false;
        }, error => console.log(error));

    }

    updatePieChart(data) {
        this.infoMessage = { item: "", value: "" };

        this.dataTableDATA = [
            ['Task', 'Hours per Day'],
            ['Days without violations', parseInt((data.with_out_violation != "" && data.with_out_violation != null) ? data.with_out_violation : 0)],
            ['Violations of the working schedule', parseInt((data.violation_at_working_schedule != "" && data.violation_at_working_schedule != null) ? data.violation_at_working_schedule : 0)],
            ['Number of delays', parseInt((data.nr_delay != "" && data.nr_delay != null) ? data.nr_delay : 0)],
            ['Absences at the end of the day', parseInt((data.absence_at_end_of_work != "" && data.absence_at_end_of_work != null) ? data.absence_at_end_of_work : 0)]
        ];

        this.pieChart.dataTable = this.dataTableDATA;

        if (this.totalPieRows > 0) {
            let pieChartComponent = this.pieChart.component;
            let pieChartWrapper = pieChartComponent.wrapper;
            //force a redraw
            pieChartComponent.draw();
        }

        if ((data.with_out_violation != "" && data.with_out_violation != null && data.with_out_violation != 0) ||
            (data.violation_at_working_schedule != "" && data.violation_at_working_schedule != null && data.violation_at_working_schedule != 0) ||
            (data.nr_delay != "" && data.nr_delay != null && data.nr_delay != 0) ||
            (data.absence_at_end_of_work != "" && data.absence_at_end_of_work != null && data.absence_at_end_of_work != 0)) {
            this.totalPieRows = 1;
        } else {
            this.totalPieRows = 0;
        }
    }

    updateColumnChart(data) {
        let columnChartData = [];
        columnChartData.push(['weekday', 'Work day', 'The employee has worked', 'Overwork', 'Not completed']);
        data.summary.forEach((value: any) => {
            let employeeWorkedHour: number = parseInt(value.worked_hours);
            let notCompleted: number = 0;
            let overTime: number = 0;

            if (parseInt(data.working_hours) > parseInt(value.worked_hours)) {
                notCompleted = parseInt(data.working_hours) - parseInt(value.worked_hours);
                employeeWorkedHour = parseInt(value.worked_hours);
            }
            else if (parseInt(data.working_hours) < parseInt(value.worked_hours)) {
                overTime = parseInt(value.worked_hours) - parseInt(data.working_hours);
                employeeWorkedHour = parseInt(data.working_hours);
            }
            let date = this.datePipe.transform(new Date(value.date), "dd-MMM");
            columnChartData.push([date, parseInt(data.working_hours), employeeWorkedHour, overTime, notCompleted]);
        });

        this.columnChart.dataTable = columnChartData;

        if (this.totalColRows > 0) {
            let columnChartComponent = this.columnChart.component;
            let columnChartWrapper = columnChartComponent.wrapper;
            //force a redraw
            columnChartComponent.draw();
        }
    }

    searchEmployeeData() {
        this.isSubmited = true;
        if (this.empDataSearchForm.valid) {
            this.searchBtnDisabled = true;
            this.getEmployeeDataList();
        }
    }

    getFilterParams() {
        let filterParams = {};

        filterParams['date_from'] = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
        filterParams['date_to'] = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");

        if (this.empDataSearchForm.valid) {

            if (this.empDataSearchForm.value.employee != "") {
                filterParams["msisdn"] = this.empDataSearchForm.value.employee;
            }

            if (this.empDataSearchForm.value.fromDate != "") {
                let fromDateObj = this.empDataSearchForm.value.fromDate;
                filterParams["date_from"] = this.datePipe.transform(new Date(fromDateObj['year'], fromDateObj['month'] - 1, fromDateObj['day']), "yyyy-MM-dd HH:mm:ss");
            }

            if (this.empDataSearchForm.value.toDate != "") {
                let toDateObj = this.empDataSearchForm.value.toDate;
                filterParams["date_to"] = this.datePipe.transform(new Date(toDateObj['year'], toDateObj['month'] - 1, toDateObj['day'],23,59,59),   "yyyy-MM-dd HH:mm:ss");
            }
        }
        return filterParams;
    }

    chartReady(data) {
        this.showLegendPieChart = true;
    }
    exportData() {
        console.log(this.empDataSearchForm.controls.employee);
        if (this.empDataSearchForm.valid) {
            this.exportBtnDisabled = true;
            let params = {};
            let filterParams = this.getFilterParams();
            if (filterParams != null) {
                params = this.getFilterParams();
            }
    
            this.employeeDataService.getAll(params).pipe(takeUntil(componentDestroyed(this))).subscribe(data => {
        
                this.generateCSV(data);
                this.exportBtnDisabled = false;
            }, error => console.log(error));
    
        }

       
        
    }

    generateCSV(data){
        let fromDate = this.f.fromDate.value.year + '-' + this.f.fromDate.value.month + '-' + this.f.fromDate.value.day;
        let toDate = this.f.toDate.value.year + '-' + this.f.toDate.value.month + '-' + this.f.toDate.value.day;

        let OBJLIST = [];
        console.log(data);
        if(data['summary'].length!=0){
            let obj = new EmployeeDataCsvModel(fromDate + ' ' + toDate + ' ' + this.selectedEmployee, data['with_out_violation'], data['violation_at_working_schedule'], data['nr_delay'], data['absence_at_end_of_work'], data['working_hours'], data['summary'][0]['worked_hours'], Number(data['summary'][0]['worked_hours']), Number(data['summary'][0]['worked_hours']) - 7.5, 7.5 - Number(data['summary'][0]['worked_hours']));
            OBJLIST.push(obj);
    
            for (let i = 1; i < data['summary'].length; i++) {
                obj = new EmployeeDataCsvModel(fromDate + ' ' + toDate + ' ' + this.selectedEmployee, '', '', '', '', '', data['summary'][i]['worked_hours'], Number(data['summary'][i]['worked_hours']), Number(data['summary'][i]['worked_hours']) - 7.5, 7.5 - Number(data['summary'][i]['worked_hours']));
                OBJLIST.push(obj);
            }
            console.log(this.getFilterParams());
            exportCSV('DataofEmployee.csv', OBJLIST);
            console.log("Export data", data);
        }
        
    }
    // generateCSV(data){
    //     let fromDate = this.f.fromDate.value.year + '-' + this.f.fromDate.value.month + '-' + this.f.fromDate.value.day;
    //     let toDate = this.f.toDate.value.year + '-' + this.f.toDate.value.month + '-' + this.f.toDate.value.day;

    //     let OBJLIST = []
    //     let obj = new EmployeeDataCsvModel(fromDate + ' ' + toDate + ' ' + this.selectedEmployee, this.employeeData['with_out_violation'], this.employeeData['violation_at_working_schedule'], this.employeeData['nr_delay'], this.employeeData['absence_at_end_of_work'], this.employeeData['working_hours'], this.employeeData['summary'][0]['date'], Number(this.employeeData['summary'][0]['worked_hours']), Number(this.employeeData['summary'][0]['worked_hours']) - 7.5, 7.5 - Number(this.employeeData['summary'][0]['worked_hours']));
    //     OBJLIST.push(obj);

    //     for (let i = 1; i < this.employeeData['summary'].length; i++) {
    //         obj = new EmployeeDataCsvModel(fromDate + ' ' + toDate + ' ' + this.selectedEmployee, '', '', '', '', '', this.employeeData['summary'][i]['date'], Number(this.employeeData['summary'][i]['worked_hours']), Number(this.employeeData['summary'][i]['worked_hours']) - 7.5, 7.5 - Number(this.employeeData['summary'][i]['worked_hours']));
    //         OBJLIST.push(obj);
    //     }
    //     console.log(this.getFilterParams());
    //     exportCSV('DataofEmployee.csv', OBJLIST);
    //     console.log("Export data", this.employeeData);
    // }
    get f() {
        return this.empDataSearchForm.controls;
    }

    getControlsOnStyleDisplay() {
        console.log('getControlsOnStyleDisplay',this.employeeData);
        if(this.employees) {
          return "block";
        } else {
          return "none";
        }
      }
}



