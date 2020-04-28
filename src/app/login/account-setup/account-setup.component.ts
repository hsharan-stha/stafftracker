import { Component, OnInit } from '@angular/core';
import { AccountSetupService } from './account-setup.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { Router } from '@angular/router';
import { getShortHexColorCode } from '@shared/shortHexColor';
import { componentDestroyed } from 'src/app/core/takeUntil-function';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommService } from '@shared/map/services/comm.service';
import { AlertMessageService } from "./../../service/alert-message.service";
import { MessageAccount } from './StaticData/message.account';

@Component({
  selector: 'account-setup',
  templateUrl: './account-setup.component.html',
  styleUrls: ['./account-setup.component.css']
})
export class AccountSetupComponent implements OnInit {
  showCurrent = 'accountInfo';
  accountInfoForm: FormGroup;
  companyInfoForm: any;
  scheduleSetupForm: FormGroup;
  geozoneForm: FormGroup;
  tempForm: FormGroup;
  lat;
  long;
  constructor(
    private formBuilder: FormBuilder,
    private accountServiceSetup: AccountSetupService,
    private authService: AuthenticationService,
    private router: Router,
    private commService: CommService,
    private alertService: AlertMessageService,
  ) { }

  ngOnInit() {
    this.geozoneListener();
  }
  geozoneListener(){
    this.commService.getCoordinateLIST()
    .pipe(takeUntil(componentDestroyed(this))).subscribe(
      data => {
        this.lat = data[0];
        this.long = data[1];
      }
    )
  }
  onAccountInfoClick(e) {
    this.accountInfoForm = e;
    this.showCurrent = 'companyInfo';
    console.log(this.accountInfoForm);
  }

  onCompanyInfoClick(e) {
    this.companyInfoForm = e;
    this.showCurrent = 'schedule';
  }
  onCompanyInfoBackClick(e) {
    this.showCurrent = 'accountInfo';
  }
  onScheduleClick(e) {
    this.scheduleSetupForm = e;
    this.accountServiceSetup.setMessage(true);
    this.showCurrent = 'geozone';

  }
  onScheduleBackClick(e) {
    this.showCurrent = 'companyInfo';
  }
  onGeozoneClick(e) {
    this.geozoneForm = e;
    
    this.tempForm = this.formBuilder.group({
      'phoneNumber': [this.accountInfoForm['phoneNumber']],
      'activation_code': [this.accountInfoForm['activationCode']],
      'email': [this.accountInfoForm['email']],
      'password': [this.accountInfoForm['pwd']],
      'company_name': [this.companyInfoForm.get('companyName')],
      'icon_url': [''],
      'days': [this.scheduleSetupForm.value['days']],
      'end_work': [this.scheduleSetupForm.value['endWorkTime']],
      'start_lunch': [this.scheduleSetupForm.value['startLunchTime']],
      'end_lunch': [this.scheduleSetupForm.value['endLunchTime']],
      'start_work': [this.scheduleSetupForm.value['startWorkTime']],
      'loyalty': [this.scheduleSetupForm.value['loyalty']],
      'track_freq': [this.scheduleSetupForm.value['trackingFrequency']],
      'geozone_name': [this.geozoneForm.value['geozone']],
      'geozone_address': [this.geozoneForm.value['address']],
      'geozone_radius': [this.geozoneForm.value['radius']],
      'geozone_color': [this.geozoneForm.value['color']],
      
    });
    // let data = {
    //   "msisdn": this.accountInfoForm['phoneNumber'],
    //   "activation_code": this.accountInfoForm['activationCode'],
    //   "email": this.accountInfoForm['email'],
    //   "password": this.accountInfoForm['pwd'],
    //   "company_name": this.companyInfoForm.value['companyName'],
    //   "icon_url": '127.0.0.1/abc.pjp',
    //   "days": "3",
    //   "end_work": this.scheduleSetupForm.value['endWorkTime'],
    //   "start_lunch": this.scheduleSetupForm.value['startLunchTime'],
    //   "end_lunch": this.scheduleSetupForm.value['endLunchTime'],
    //   "start_work": this.scheduleSetupForm.value['startWorkTime'],
    //   "loyalty": this.scheduleSetupForm.value['loyalty'],
    //   "track_freq": this.scheduleSetupForm.value['trackingFrequency'],
    //   "geozone_name": this.geozoneForm.value['geozone'],
    //   "geozone_address": this.geozoneForm.value['address'],
    //   "geozone_radius": this.geozoneForm.value['radius'],
    //   "geozone_color": getShortHexColorCode(this.geozoneForm.value['color'])
    // }
   
    const uploadData = new FormData();
    
    uploadData.append('msisdn', this.tempForm.get('phoneNumber').value);
    //uploadData.append('activation_code', this.tempForm.get('activation_code').value);
    uploadData.append('email', this.tempForm.get('email').value);
    uploadData.append('password', this.tempForm.get('password').value);
    uploadData.append('company_name', this.tempForm.get('company_name').value);
    uploadData.append('schedule_name', 'default schedule');
    console.log(this.companyInfoForm.get('image'));
    if((this.companyInfoForm.get('image'))!="" && (this.companyInfoForm.get('image'))!=null){
            uploadData.append('image', this.companyInfoForm.get('image'));
    }
    uploadData.append('days', this.tempForm.get('days').value);
    uploadData.append('end_work', this.tempForm.get('end_work').value);
    uploadData.append('start_lunch', this.tempForm.get('start_lunch').value);
    uploadData.append('end_lunch', this.tempForm.get('end_lunch').value);
    uploadData.append('start_work', this.tempForm.get('start_work').value);
    uploadData.append('loyalty', this.tempForm.get('loyalty').value);
    uploadData.append('track_freq', this.tempForm.get('track_freq').value);
    uploadData.append('geozone_name', this.tempForm.get('geozone_name').value);
    uploadData.append('geozone_address', this.tempForm.get('geozone_address').value);
    uploadData.append('geozone_radius', this.tempForm.get('geozone_radius').value);
    uploadData.append('geozone_color', getShortHexColorCode(this.geozoneForm.value['color']));
    uploadData.append('lat', this.lat);
    uploadData.append('long', this.long);

    this.authService.registrationFinalize(uploadData)
      .pipe(takeUntil(componentDestroyed(this))).subscribe(
        data =>{ 
            this.success(MessageAccount.RegisterCompleted);
            console.log(data);
        },
        err =>{ 
            console.log(err);
            this.error(err);
        },
        () => {
          this.authService.login(this.accountInfoForm['phoneNumber'], this.accountInfoForm['pwd'])
            .pipe(takeUntil(componentDestroyed(this))).subscribe(
              data => this.router.navigate(['main'])
            )
        }
      )
  }
  onGeozoneBackClick(e) {
    this.accountServiceSetup.setMessage(false);
    this.showCurrent = 'schedule';
  }
  ngOnDestroy() { }
  
    success(message): void {
        this.alertService.show({
            message: message,
            alertType: "success"
        });
    }

    error(err): void {
        console.log(err.error.result);
        this.alertService.show({
            message: err.error.result,
            alertType: "error"
        });
    }
}
