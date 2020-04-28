import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/core/takeUntil-function';
import { EmployeeService } from '../service/employee.service';
import { StaticData } from '../StaticData/staticdata.employee';
import { MessageEmployee } from '../StaticData/message.employee';
import {AlertMessageService} from "./../../service/alert-message.service";

@Component({
  selector: 'employee-delete',
  templateUrl: './employee-delete.component.html',
  styleUrls: ['./employee-delete.component.css']
})
export class EmployeeDeleteComponent implements OnInit {
    showConfirmBox: boolean = true;
    private employeeID: number;
    private DeleteTitle: string = StaticData.DeleteTitle;
    private DeleteWarning: string = MessageEmployee.DeleteWarnMessage;
    private mainPage: string = StaticData.MainPage;
    
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private employeeService: EmployeeService,
        private alertMessageService: AlertMessageService) { 
          this.route.params.pipe(takeUntil(componentDestroyed(this))).subscribe(params => this.employeeID = parseInt(params['id']));
    }

    ngOnInit() {
        console.log(this.employeeID);
    }
    ngOnDestroy(): void {
    }
    
    confirm($event){
        if($event){
            this.employeeService.removeEmployee(this.employeeID).pipe(takeUntil(componentDestroyed(this))).subscribe(
            data=>{
                if (data['code'] === 0) {
                    this.employeeService.setNotify(true);
                    this.alertMessageService.show({
                        message: MessageEmployee.EmployeeRemoved,
                        alertType: "success"
                    });
                    this.redirectMainPage();
                }
            },
            err=>{
                this.alertMessageService.show({
                    message: err.error.result,
                    alertType: "error"
                });
            })
        }
    }
    
    cancel($event) {
        if ($event) {
            this.showConfirmBox = false;
            this.redirectMainPage();
        }
    }

    redirectMainPage(): void {
        this.router.navigate([this.mainPage]);
    }


}
