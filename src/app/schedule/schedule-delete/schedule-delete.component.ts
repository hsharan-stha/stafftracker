import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AlertMessageService} from "../../service/alert-message.service";
import {takeUntil} from "rxjs/operators";
import {componentDestroyed} from "../../core/takeUntil-function";
import {Staticdata} from "../StaticData/staticdata.schedule";
import {ScheduleService} from "../service/schedule.service";
import {Message} from "../StaticData/message.schedule";

@Component({
    selector: 'schedule-delete',
    templateUrl: './schedule-delete.component.html',
    styleUrls: ['./schedule-delete.component.css']
})
export class ScheduleDeleteComponent implements OnInit {

    schedule_id;
    showConfirmBox: boolean = true;
    mainPage = Staticdata.MAINPAGE;

    constructor(private router: Router,
                private service: ScheduleService,
                private route: ActivatedRoute,
                private alertService: AlertMessageService) {
        this.route.params.pipe(takeUntil(componentDestroyed(this))).subscribe(params => this.schedule_id = parseInt(params['id']));

    }

    ngOnInit() {
    }

    confirm($event) {
        if ($event) {
            if (this.schedule_id) {
                this.service.remove(this.schedule_id).pipe(takeUntil(componentDestroyed(this))).subscribe(
                    res => {
                        console.log(res);
                        if (res['code'] === 0) {
                            this.service.setNotify(true);
                            this.alertService.show({
                                message: Message.DELETE_SUCCESS,
                                alertType: "success"
                            });
                            this.redirectMainPage();
                        }
                    }, err => {
                        this.alertService.show({
                            message: err.error.result,
                            alertType: "error"
                        });
                    }
                )
            }
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

    ngOnDestroy() {
    }

}
