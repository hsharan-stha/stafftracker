import { Component, OnInit,HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { DataService } from './../../service/data.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { componentDestroyed } from 'src/app/core/takeUntil-function';
import { takeUntil } from 'rxjs/operators';
import { AccountSetupService } from '../account-setup/account-setup.service';
import { KeyCode } from './../key-code.model';


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
    public mask = ['0', '6', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
    signupForm: FormGroup;
    errorMessage;
    constructor(
        private router: Router,
        private fb: FormBuilder,
        private titleService: Title,
        private data: DataService,
        private authService: AuthenticationService,
        private accountSetupService: AccountSetupService
    ) { }

    ngOnInit() {
        this.titleService.setTitle("Staff Tracker | Sign Up")
        this.createForm();
    }

    createForm(): void {
        this.signupForm = this.fb.group({
            phone_number: ["", [Validators.required]],
            userAgreement: ['', [Validators.requiredTrue]]
        });
    }

    btnClicked() {
        if(this.signupForm.valid){
            this.data.setOption('phoneNumber', this.signupForm.value.phone_number);
            this.accountSetupService.setPhone(this.signupForm.value.phone_number);
            this.authService.getActivationCode(this.f.phone_number.value)
                .pipe(takeUntil(componentDestroyed(this))).subscribe(
                    data => {
                        console.log(data);
                        this.authService.setActivationCode(data['result']);
                        this.router.navigate(['activation-code']);
                    },
                    error=>{
                        let err = error.error; 
                        // this.errorMessage = '';
                        // this.signupForm.controls['phone_number'].setErrors({'incorrect': false});
                        if(err['code']==-17){
                            this.errorMessage = {"incorrect":"This service was activated on + (XXX) YYYYYYYY phone number before! To reset the password, send an SMS with the text RESET to XXX from +(XXX) YYYYYYY"};
                        }
                        else{
                            if(err['result']){
                                this.errorMessage = {"incorrect":err['result']};
                            }
                            else{
                                this.errorMessage = {"incorrect":error['statusText']};
                            }
                        }       
                        this.signupForm.controls['phone_number'].setErrors({'incorrect': true});
                    },
                    ()=>{}
                );
        }
    }
    
    get f() {
        return this.signupForm.controls;
    }
    onInputChange(){
        this.errorMessage = null;
        this.signupForm.controls['phone_number'].setErrors({'incorrect': false});
    }
    ngOnDestroy(): void {
    }
    
    
    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
      console.log(event);

      if(event.keyCode=== KeyCode.ENTER_KEY){
          this.btnClicked();
      }
    }
}