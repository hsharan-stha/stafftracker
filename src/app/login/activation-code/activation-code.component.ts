import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DataService } from './../../service/data.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CustomValidators } from 'src/app/validation/CustomValidators';
import { componentDestroyed } from 'src/app/core/takeUntil-function';
import { takeUntil } from 'rxjs/operators';
import { AccountSetupService } from '../account-setup/account-setup.service';

@Component({
    selector: 'app-activation-code',
    templateUrl: './activation-code.component.html',
    styleUrls: ['./activation-code.component.css']
})

export class ActivationCodeComponent implements OnInit {
    public mask = ['0', '6', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
//    public mask = ['+', '3', '7', '3', ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]
    errorMessage;
    isEnteredCode: boolean = false;
    activationForm: FormGroup;
    constructor(private router: Router,
        private formBuilder: FormBuilder,
        private data: DataService,
        private authService: AuthenticationService,
        private accountSetupService: AccountSetupService
    ) { }

    ngOnInit() {

        this.activationForm = this.formBuilder.group({
            'activationCode': ['', [Validators.required]],
            'checkActivationCode': [this.authService.activationCode],
            'phoneNumber': [{ value: this.data.getOption('phoneNumber'), disabled: true }, [Validators.required]]
        }
            // , {
            //     validator: CustomValidators('activationCode', 'checkActivationCode')
            //   }
        );
        console.log(this.accountSetupService.phone);
        
        if (this.f.phoneNumber.value != undefined) {
            this.activationForm.patchValue({
                'phoneNumber': this.accountSetupService.phone
            });
        }
        setInterval(() => { this.activationForm.controls.phoneNumber }, 2000);
    }

    btnClicked() {
        this.data.setOption('phoneNumber', this.data.getOption('phoneNumber'));
        this.data.setOption('activationCode', this.activationForm.value.activationCode);
        this.authService.register(this.f.phoneNumber.value, this.f.activationCode.value)
            .pipe(takeUntil(componentDestroyed(this))).subscribe(data => {
                console.log(data);
                this.router.navigate(['account-setup']);
            },
                error => {
                    let err = error.error;
                    if (err['code'] == -9) {
                        this.errorMessage = { "incorrect": "The incorrect activation code is entered!" };
                    }
                    else if (err['code'] == -7) {
                        this.errorMessage = { "incorrect": "You have not set up all the necessary arguments!" };
                    }
                    else {
                        if(err['result']){
                            this.errorMessage = { "incorrect": err['result'] };
                        }
                        else{
                            this.errorMessage = { "incorrect": error['statusText'] };
                        }
                    }
                    this.activationForm.controls['activationCode'].setErrors({ 'incorrect': true });
                },
                () => { });

    }

    get f() {
        return this.activationForm.controls;
    }
    ngOnDestroy() { }
}
