import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/core/takeUntil-function';
import { CompanyInfoService } from '../service/company-info.service';
import { CompanyInfoModel,CompanyInfoFormModel } from '../model/company-info.model';
import { AlertMessageService } from "./../../service/alert-message.service";
import {ScheduleService} from "src/app/schedule/service/schedule.service";
import { GeozoneService } from 'src/app/geozone/service/geozone.service';
import { Schedule } from 'src/app/schedule/model/schedule.model';
import { StaticData } from '../StaticData/staticdata.company-info';
import { MessageCompanyInfo } from '../StaticData/message.company-info';
import { CaptchaService } from "./../../service/captcha.service";

@Component({
  selector: 'company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.css']
})
export class CompanyInfoComponent implements OnInit {
     public mask = ['0', '6', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
    companyInfoForm : FormGroup;
    infoText :string = "{time}";
    avatarUrl: string;
    BASEIPURL: string;
    isSubmited: boolean = false;
    fileData: File;
    loader:boolean = false;
    btnDisabled: boolean = false;
    schedule:any = [];
    geozone:any = [];
    mainPage: string = StaticData.MainPage;
    
    constructor(
        private formBuilder: FormBuilder, 
        private router: Router,
        private companyInfoService: CompanyInfoService,
        private scheduleService: ScheduleService,
        private geozoneService: GeozoneService,
        private alertService: AlertMessageService,
        private captchaService: CaptchaService
        ) { }

    ngOnInit() {
        this.BASEIPURL=this.companyInfoService.getBaseIPURL();
        this.initForm();
        this.getCompanyInfo();
    }
    
    getCompanyInfo(){
        this.loader = true;
        this.companyInfoService.getCompanyInfo().pipe(takeUntil(componentDestroyed(this))).subscribe(
                (data)=>{
                    console.log(data);
                    this.companyInfoForm.patchValue({
                            'id': data.id,
                            'msisdn' : data.msisdn,
                            'email' : data.email,
                            'name' : data.name
                        }
                    );
                    
                    this.avatarUrl = (data.icon_url!="" && data.icon_url!=null)?this.BASEIPURL+data.icon_url:"";
                    
                    if(this.avatarUrl){
                        this.removeValidationFromImg();
                    }else{
                        this.setValidationOnImg();
                    }
                    this.loader = false;
                },
                (error)=>{
                    console.log(error);
                }
            );
        let scheduleParams = {
            "limit": 1,
            "page_number": 1,
            "filters":{
                "is_default":1
            }
        };  
        this.scheduleService.getAll(scheduleParams).pipe(takeUntil(componentDestroyed(this))).subscribe(
            (data)=> {
                this.schedule = (typeof data[0]!="undefined")?data[0]:[];
                this.loader = false;
            }
        );
        
        let geozoneParams = {
            "limit": 1,
            "page_number": 1,
            "filters":{
                "is_default":1
            }
        };
        this.geozoneService.getAll(geozoneParams).pipe(takeUntil(componentDestroyed(this))).subscribe(
            data => {
                this.geozone = (typeof data[0]!="undefined")?data[0]:[];
                this.loader = false;
            }
        );
    }
  
    initForm(){
        this.companyInfoForm = this.formBuilder.group({
            'id':'',
            'msisdn' : ['',[Validators.required]],
            'email' : ['hr@info.com',[Validators.required]],
            'image':[null,Validators.required],
            'name' : ['Takamaru Ayako',[Validators.required]]

            })
      }
      
      
    setValidationOnImg(){
        const imageControl = this.companyInfoForm.get('image');
        imageControl.setValidators([Validators.required]);
        imageControl.updateValueAndValidity();
    }
    
    removeValidationFromImg(){
        const imageControl = this.companyInfoForm.get('image');
        imageControl.setValue("");
        imageControl.clearValidators();
        imageControl.updateValueAndValidity();

    }
      
    changeAvatar($event){
        this.fileData = <File>$event.file;
    }

    btnBackClicked(){
        this.redirectMainPage();
    }
    
    btnNextClicked(){
        this.isSubmited = true;
        if(this.companyInfoForm.valid){
            this.btnDisabled = true;
            this.getCaptchaToken();
        }
    }
    
    storeCompanyInfoData(){
        let data = this.companyInfoForm.value;
        data['icon_url'] = this.fileData;
        this.companyInfoService.update(data).pipe(takeUntil(componentDestroyed(this))).subscribe(
            data => {
                if (data['code'] === 0) {
                    this.success(MessageCompanyInfo.CompanyUpdated);
                }
                this.btnDisabled = false;
            },
            error=> {
                console.log(error);
                this.error(error);
                this.btnDisabled = false
            }
        );
    }
    
    getCaptchaToken(){
        this.captchaService.getCaptch().pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                data => {
                    if (data.code === 0) {
                        this.checkCaptchaToken(data.result);
                    }
                    console.log(data); 
                },
                error => {
                    this.error(error);  
                    this.btnDisabled = false;
                },
            );
    }
    
    checkCaptchaToken(captcha){
        this.captchaService.checkCaptcha({"captcha_code":captcha}).pipe(takeUntil(componentDestroyed(this)))
            .subscribe(
                    data=>{
                        if(data.code==0){
                            this.storeCompanyInfoData();
                        }
                        console.log(data);
                    },
                    error=>{
                        this.error(error); 
                        this.btnDisabled = false;
                    }
                );
    }
    
    
    editSchedule(id){
        this.router.navigate([StaticData.ScheduleEditPage + id]);
        console.log(id);
    }
    
    editGeozone(id){
        this.router.navigate([StaticData.GeozoneEditPage + id]);
        console.log(id);
    }
    
    ngOnDestroy(): void {
    }
    
    success(message): void {
        this.alertService.show({
            message: message,
            alertType: "success"
        });
        this.redirectMainPage();
    }

    error(err): void {
        console.log(err.error.result);
        this.alertService.show({
            message: err.error.result,
            alertType: "error"
        });
    }
    
    redirectMainPage(){
        this.router.navigate([this.mainPage]);
    }
}
