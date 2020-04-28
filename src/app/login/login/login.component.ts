import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/core/takeUntil-function';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    /**
     * Login form Group
     *
     * @type FormGroup
     */
    loginForm: FormGroup;
    invalidMessages;
    returnUrl: string;
    resetPasswordMessage: string = "To reset the password-send SMS with the text RESET to the xxxx Staff Tracker Service Number from Your phone number.";
    errorMessagePhone;
    errorMessagePassword;
    constructor(
        private fb: FormBuilder,
        private titleService: Title,
        private authenticationService: AuthenticationService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        if (this.authenticationService.access_tokenValue) {
            console.log(this.authenticationService.access_tokenValue);
            this.router.navigate(['/main']);
        }
    }

    ngOnInit() {
        this.titleService.setTitle("Staff Tracker | Login");
        this.createForm();
        this.loginForm.valueChanges.subscribe(
            (data) => {
                console.log(data)
            }
        )
        console.log(this.loginForm)
    }

    /**
     * Create Login form
     *
     * @return void
     */
    createForm(): void {
        this.loginForm = this.fb.group({
            phone_number: ["", [Validators.required]],
            password: ["", [Validators.required]]
        });
    }

    get f() {
        return this.loginForm.controls;
    }

    onSubmit() {
        this.authenticationService.login(this.f.phone_number.value, this.f.password.value)
            .pipe(takeUntil(componentDestroyed(this))).subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    let err = error['error'];
                    if (err && err['code'] == -8) {
                        this.errorMessagePassword = { "incorrect": "The incorrect phone number or password is entered." }
                        this.errorMessagePhone = { "incorrect": "The incorrect phone number or password is entered." }
                        this.loginForm.controls['phone_number'].setErrors({ 'incorrect': true });
                        this.loginForm.controls['password'].setErrors({ 'incorrect': true });
                    } else if (err && err['code'] == -9) {
                        this.errorMessagePhone = { "incorrect": err['result'] }
                        this.loginForm.controls['phone_number'].setErrors({ 'incorrect': true });
                    } else if (err && err['code'] == -7) {

                    }
                    else {
                        if (err && err['result']) {
                            this.errorMessagePhone = { "incorrect": err['result'] };
                            this.errorMessagePassword = { "incorrect": err['result'] };
                        }
                        else {
                            this.errorMessagePhone = { "incorrect": error['statusText'] };
                            this.errorMessagePassword = { "incorrect": error['statusText'] };
                        }

                        this.loginForm.controls['phone_number'].setErrors({ 'incorrect': true });
                        this.loginForm.controls['password'].setErrors({ 'incorrect': true });
                    }
                },
                () => { });
    }
    ngOnDestroy(): void {
    }

    ngAfterContentInit() {
        if (this.route.snapshot.queryParams['returnUrl'] == 'login') {
            this.returnUrl = 'main';
        }
        else {
            this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'main';
        }

    }
}

//