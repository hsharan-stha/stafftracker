import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {PositionService} from "../service/position.service";
import {AlertMessageService} from "../../service/alert-message.service";
import {Staticdata} from "../StaticData/staticdata.position";
import {Message} from "../StaticData/message.position";
import {takeUntil} from 'rxjs/operators';
import {componentDestroyed} from 'src/app/core/takeUntil-function';

@Component({
    selector: 'position-delete',
    templateUrl: './position-delete.component.html',
    styleUrls: ['./position-delete.component.css']
})
export class PositionDeleteComponent implements OnInit {

    showConfirmBox: boolean = true;
    mainPage = Staticdata.MAINPAGE;

    constructor(private router: Router,
                private service: PositionService,
                private alertService: AlertMessageService) {
    }

    ngOnInit() {

    }

    confirm($event) {
        if ($event) {
            let extract = this.router.url.split("/");
            if ("delete" == extract[extract.length - 2]) {
                this.service.remove(extract[4]).pipe(takeUntil(componentDestroyed(this))).subscribe(
                    res => {
                        console.log(res);
                        if (res['code'] === 0) {
                            this.service.setNotify(true);
                            this.alertService.show({
                                message: Message.DELETE_SUCCESS,
                                alertType: "success"
                            });
                            this.redirectMainPage()
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
