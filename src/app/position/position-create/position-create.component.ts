import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PositionService} from "../service/position.service";
import {Staticdata} from "../StaticData/staticdata.position";
import {AlertMessageService} from "../../service/alert-message.service";
import {Message} from "../StaticData/message.position";
import {takeUntil} from 'rxjs/operators';
import {componentDestroyed} from 'src/app/core/takeUntil-function';

@Component({
    selector: 'position-create',
    templateUrl: './position-create.component.html',
    styleUrls: ['./position-create.component.css']
})
export class PositionCreateComponent implements OnInit {

    positionForm: FormGroup;
    position_id = null;
    pageTitle1 = Staticdata.ADDNEW;
    pageTitle2 = Staticdata.NEW;
    pageTitle3 = Staticdata.ADDTITLE;
    btnSaveUpdate = Staticdata.SAVE;
    btnBack = Staticdata.BACK;
    mainPage = Staticdata.MAINPAGE;
    loader: boolean = false;
    insertLoader: boolean = false;
    btnDisabled: boolean = false;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private service: PositionService,
        private alertService: AlertMessageService
    ) {
        this.route.params.pipe(takeUntil(componentDestroyed(this))).subscribe(params => this.position_id = parseInt(params['id']));
    }

    ngOnInit() {
        this.createForm();
        this.checkEdit();
    }

    checkEdit(): void {
        if (this.position_id) {
            this.loader = true;
            this.pageTitle1 = Staticdata.EDIT;
            this.pageTitle2 = Staticdata.EDIT;
            this.pageTitle3 = Staticdata.EDITTITLE;
            this.btnSaveUpdate = Staticdata.UPDATE;
            this.service.getByID(this.position_id).pipe(takeUntil(componentDestroyed(this))).subscribe(
                (res) => {
                    console.log(res);
                    this.positionForm.setValue({
                            name: res.name
                        }
                    );
                    this.loader = false;
                }
            )
        }
    }

    createForm(): void {
        this.positionForm = this.fb.group({
            name: ["", [Validators.required]],
        });
    }

    storePosition() {
        if (this.positionForm.valid) {
            this.btnDisabled = true;
            this.insertLoader = true;
            let data = this.positionForm.value;
            if (this.btnSaveUpdate === Staticdata.UPDATE) {
                this.service.renew(data, this.position_id).pipe(takeUntil(componentDestroyed(this))).subscribe(
                    res => {
                        console.log(res);
                        if (res['code'] === 0) {
                            this.success(Message.UPDATE_SUCCESS);
                        }
                    }, err => {
                        this.error(err);
                    }
                );
            } else {
                this.service.add(data).pipe(takeUntil(componentDestroyed(this))).subscribe(
                    res => {
                        if (res['code'] === 0) {
                            this.success(Message.CREATE_SUCCESS);
                        }
                    }, err => {
                        this.error(err);
                    }
                );
            }
            // console.log(data);
        }
    }

    btnBackClicked() {
        this.redirectMainPage();
    }

    redirectMainPage(): void {
        this.router.navigate([this.mainPage]);
    }

    success(message): void {
        this.alertService.show({
            message: message,
            alertType: "success"
        });
        this.btnDisabled = false;
        this.insertLoader = false;
        this.redirectMainPage();
    }

    error(err): void {
        this.alertService.show({
            message: err.error.result,
            alertType: "error"
        });
        this.btnDisabled = false;
        this.insertLoader = false;
    }

    ngOnDestroy() {
    }
}
