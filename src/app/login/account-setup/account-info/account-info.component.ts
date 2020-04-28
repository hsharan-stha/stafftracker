import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from './../../../validation/CustomValidators';
import { DataService } from './../../../service/data.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {
  @Output() nextClicked: EventEmitter<any> = new EventEmitter();
customMessage='Incorrect password is entered! Password requirements: at least 6 characters, acceptable to use Latin letters, numbers and "_" sign.';
//  public mask = ['+', '3', '7', '3', ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]
    public mask = ['0', '6', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  accountInfoForm: FormGroup;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private data: DataService
  ) { }

  ngOnInit() {
    this.initForm();
    
  }

  initForm() {
    this.accountInfoForm = this.formBuilder.group({
      'phoneNumber': [{ value: this.data.getOption('phoneNumber'), disabled: true }, [Validators.required]],
      'activationCode': [{ value: this.data.getOption('activationCode'), disabled: true }, [Validators.required]],
      'email': ['hr@info.com', [Validators.required]],
      'pwd': ['', [Validators.required, Validators.minLength(6), Validators.pattern('^[a-zA-Z0-9_]+$')]],
      'confirmPwd': ['', [Validators.required, Validators.minLength(6), Validators.pattern('^[a-zA-Z0-9_]+$')]]
    }
      , {
        validator: CustomValidators('pwd', 'confirmPwd')
      })
  }

  btnBackClicked() {
    this.router.navigate(['login']);
  }

  btnNextClicked() {
    console.log(this.accountInfoForm.getRawValue());
    this.nextClicked.emit(this.accountInfoForm.getRawValue());
    //this.router.navigate(['account-setup/company-info']);
  }
  get f() {
    return this.accountInfoForm.controls;
  }
}
