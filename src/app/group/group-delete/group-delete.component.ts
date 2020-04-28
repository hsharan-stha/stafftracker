import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AlertMessageService} from "../../service/alert-message.service";
import {takeUntil} from "rxjs/operators";
import {componentDestroyed} from "../../core/takeUntil-function";
import {GroupService} from "../service/group.service";
import {Staticdata} from "../StaticData/staticdata.group";
import {Message} from "../StaticData/message.group";

@Component({
    selector: 'group-delete',
    templateUrl: './group-delete.component.html',
    styleUrls: ['./group-delete.component.css']
})
export class GroupDeleteComponent implements OnInit {


    showConfirmBox: boolean = true;
    mainPage = Staticdata.MAINPAGE;

    constructor(private router: Router,
                private service: GroupService,
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
                );
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
