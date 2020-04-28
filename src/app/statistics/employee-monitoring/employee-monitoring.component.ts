import { Component, OnInit, ElementRef, HostListener, ViewChild } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { GoogleChartComponent } from 'ng2-google-charts';
import { FormGroup, Validators, FormBuilder } from '@angular/forms'; 

@Component({
  selector: 'employee-monitoring',
  templateUrl: './employee-monitoring.component.html',
  styleUrls: ['./employee-monitoring.component.css']
})
export class EmployeeMonitoringComponent implements OnInit {
    empMonitorSearchForm: FormGroup;
    constructor(private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.initSearchForm();
    }
  
    initSearchForm(){
        this.empMonitorSearchForm = this.formBuilder.group({
            'fromDate': ['', Validators.required],
        });
        
    }
    
    infoMessage: {item:any,value:any} = {item:"",value:""};;
    //CONFIGURATION FOR BAR CHART END HEARE
    dataTableDATA=[
        ['Task', 'Hours per Day'],
        ['Employee allowed tracking ', 6],
        ['Employees included in the group', 4],
        ['Employees, charged successfully', 2],
        ['Employees who are not tracked', 8]
    ];
    dataTableCOLORS={
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
                direction:-1,
                slantedText:true,
            }
        },
    };
    //CONFIGURATION FOR PIE CHART END HERE
    
    
    //to redrawing the chart on resizing the window
    @ViewChild('pieChartView') pieChartView: GoogleChartComponent;
    @HostListener('window:resize', ['$event'])
    onWindowResize(event: any) {
        let selection = this.pieChartView.wrapper.visualization.getSelection();
        this.pieChartView.draw();
        this.pieChartView.wrapper.visualization.setSelection(selection);
    }
    
    onMouseOver(e) {
        this.infoMessage = {
            item: e['value'],
            value: this.dataTableDATA[e['position']['row']+1][1]
        };
    }
    
    chartSelect(e){
        console.log(e);
    }
    
    getDotColor(i){
        return {'background-color':this.dataTableCOLORS[i]['color']};
    }

}
