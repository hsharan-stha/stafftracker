import { Component, OnInit,ViewChild,ElementRef,Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../service/employee.service';
import { EmployeeModel } from '../model/employee.model';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/core/takeUntil-function';
import { StaticData } from '../StaticData/staticdata.employee';
import { MessageEmployee } from '../StaticData/message.employee';
import { AlertMessageService } from "./../../service/alert-message.service";
import { CustomValidators } from './../../validation/CustomValidators';
import { PositionService } from 'src/app/position/service/position.service';
import { GroupService } from 'src/app/group/service/group.service';
import { CaptchaService } from "./../../service/captcha.service";

@Component({
  selector: 'employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.css']
})
export class EmployeeCreateComponent implements OnInit {
    public mask = ['0', '6', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
     newEmployeeForm : FormGroup;
     infoText :string = "{time}";
     isAdmin: boolean = true;
     isOperator: boolean = false;
     isEmployee: boolean = false;
     groupList=[];
     positionList=[];
     role:number = 2;
     isSubmited : boolean = false;
     mainPage = StaticData.MainPage;
     fileData: File;
     employeeID : number;
     PageTitle: string = StaticData.AddTitle;
     BtnTitle: string = StaticData.SaveBtn;
     avatarUrl: string;
     BASEIPURL: string;
     loader:boolean = false;
     btnDisabled: boolean = false;
    
    @ViewChild("password") password: ElementRef;
    @ViewChild("confirm_password") confirm_password: ElementRef;

     
    changedPassword: boolean = true;
    showChangedPassword : boolean = false;
     
    constructor(
        private formBuilder: FormBuilder, 
        private router: Router,
        private employeeService: EmployeeService,
        private alertService: AlertMessageService,
        private positionService: PositionService,
        private groupService: GroupService,
        private render: Renderer2,
        private route: ActivatedRoute,
        private captchaService: CaptchaService) { 
            this.route.params.pipe(takeUntil(componentDestroyed(this))).subscribe(params => this.employeeID = parseInt(params['id']));
        }

    ngOnInit() {
        this.initForm();
        this.getGroupList();
        this.getPositionList();
        this.viewEmployeeInfo();
        this.BASEIPURL=this.employeeService.getBaseIPURL();
    }
  
    viewEmployeeInfo(){
        if(this.employeeID){
            this.loader = true;
            this.PageTitle = StaticData.EditTitle;
            this.BtnTitle = StaticData.UpdateBtn;
            this.employeeService.getEmployeeByID(this.employeeID).pipe(takeUntil(componentDestroyed(this))).subscribe(
                (data)=>{
//                    console.log(data);
                    this.newEmployeeForm.patchValue({
                            'id': this.employeeID,
                            'msisdn' : data.msisdn,
                            'email' : data.email,
                            'full_name' : data.name,
                            'group_id' : (data.group_id!=null)?data.group_id:"",
                            'position_id': (data.position_id!=null)?data.position_id:"",
                            'description' : (data.description!=null)?data.description:"",
                            'role_id' : data.role_id
                        }
                    );
                    this.avatarUrl = (data.icon_url!="" && data.icon_url!=null)?this.BASEIPURL+data.icon_url:"";
                    
                    if(this.avatarUrl){
                        this.removeValidationFromImg();
                    }else{
                        this.setValidationOnImg();
                    }
                    
                    if(data.role_id!=4){
                        this.showChangedPassword = true;
                        this.changedPassword = false;
                        this.newEmployeeForm.get('password').disable();
                        this.newEmployeeForm.get('confirm_password').disable();
                        this.removeValidationFromPwd();
                    }
                    this.togglePermissionType(this.newEmployeeForm.value.role_id);
                    this.loader = false; 
                },
                error=>{
                    console.log(error);
                }
            )
        }
        
        
    }   
     
    getPositionList(){
        let tableParam = {
            "page_number": 1,
            "order_by" :'name',
            "order_direction": "ASC" 
        };
        this.positionService.getAll(tableParam).pipe(takeUntil(componentDestroyed(this))).subscribe(
            data=>{
                this.positionList = data;
            },
            error=>{
                console.log(error); 
        });
    }
    
    getGroupList(){
        let tableParam = {
            "page_number": 1 ,
            "order_by" :'name',
            "order_direction": "ASC" 
        };
        this.groupService.getAll(tableParam).pipe(takeUntil(componentDestroyed(this))).subscribe(
            data=>{
                this.groupList = data;
            },
            error=>{
               console.log(error); 
        });
    }
    
    initForm(){
        this.newEmployeeForm = this.formBuilder.group({
            'id': [''],
            'msisdn' : ['',[Validators.required]],
            'email' : ['hr@info.com',[Validators.required]],
            'full_name' : ['',[Validators.required]],
            'group_id' : [''],
            'position_id': [''],
            'image' : [null,Validators.required],
            'description' : [''],
            'role_id' : [],
            'password' : ['',[Validators.required]],
            'confirm_password' : ['',[Validators.required]],
            'changedPassword' : []
        }, {
            validator: CustomValidators('password', 'confirm_password')
          })
      }

    togglePermissionType(data){
        if(data==2){
            this.isAdmin = true;
            this.isOperator = false;
            this.isEmployee = false;
            this.role = 2;
        }else if(data==3){
            this.isAdmin = false;
            this.isOperator = true;
            this.isEmployee = false;
            this.role = 3;
        }else if(data==4){
            this.isAdmin = false;
            this.isOperator = false;
            this.isEmployee = true;
            this.role = 4;
        }
        
        this.checkingRole(this.role);
    }
    
    checkingRole(role_id):void{
        if(role_id==2 || role_id==3){
            this.setValidationOnPwd();
            
        } else if(role_id==4){
            this.removeValidationFromPwd();
        }
    }
    
    setValidationOnPwd(){
        const passwordControl = this.newEmployeeForm.get('password');
        const confirmPasswordControl = this.newEmployeeForm.get('confirm_password');
        
        passwordControl.setValidators([Validators.required]);
        passwordControl.updateValueAndValidity();
        
        confirmPasswordControl.setValidators([Validators.required]);
        confirmPasswordControl.updateValueAndValidity();
    }
    
    removeValidationFromPwd(){
        const passwordControl = this.newEmployeeForm.get('password');
        const confirmPasswordControl = this.newEmployeeForm.get('confirm_password');
        
        passwordControl.setValue("");
        passwordControl.clearValidators();
        passwordControl.updateValueAndValidity();

        confirmPasswordControl.setValue("");
        confirmPasswordControl.clearValidators();
        confirmPasswordControl.updateValueAndValidity();
    }
    
    setValidationOnImg(){
        const imageControl = this.newEmployeeForm.get('image');
        imageControl.setValidators([Validators.required]);
        imageControl.updateValueAndValidity();
    }
    
    removeValidationFromImg(){
        const imageControl = this.newEmployeeForm.get('image');
        imageControl.setValue("");
        imageControl.clearValidators();
        imageControl.updateValueAndValidity();

    }
    
    btnBackClicked(){
        this.router.navigate(['main/employee']);
        console.log("back btn clicked");
    }
    
    changeAvatar($event){
        this.fileData = <File>$event.file;
    }
    
    btnNextClicked(){
        this.isSubmited  = true;
        
        this.newEmployeeForm.patchValue({
            'role_id': this.role
        });
        
        if(this.newEmployeeForm.valid){
            this.btnDisabled = true;
            this.getCaptchaToken();
        }
    }
    
    storeEmployeeData(){
        let data = this.newEmployeeForm.value;
        console.log(data);
        const uploadData = new FormData();
        
        if(((this.newEmployeeForm.get('image').value)!="" && data.id!=null && data.id>0 && data.id!="") || data.id==""){
            uploadData.append('image', this.fileData);
        }
        
        uploadData.append('email', this.newEmployeeForm.get('email').value);
        uploadData.append('msisdn', this.newEmployeeForm.get('msisdn').value);
        uploadData.append('full_name', this.newEmployeeForm.get('full_name').value);
        uploadData.append('description', this.newEmployeeForm.get('description').value);
        uploadData.append('group_id', this.newEmployeeForm.get('group_id').value);
        uploadData.append('position_id', this.newEmployeeForm.get('position_id').value);
        uploadData.append('role_id', this.newEmployeeForm.get('role_id').value);

        if(this.changedPassword){
            uploadData.append('password', this.newEmployeeForm.get('password').value);
        }

        if(this.newEmployeeForm.get('role_id').value==4){
            uploadData.append('password', null);
        }

        if(data.id!=null && data.id>0 && data.id!=""){
            uploadData.append('id', this.newEmployeeForm.get('id').value);
            this.employeeService.updateEmployees(uploadData).pipe(takeUntil(componentDestroyed(this))).subscribe(
                data => {
                    if (data['code'] === 0) {
                        this.success(MessageEmployee.EmployeeUpdated);
                    }
                        this.btnDisabled = false;
                        console.log(data);
                    },
                error => {
                        this.error(error); 
                        this.btnDisabled = false;
                    console.log(error);
                });
        }else{
            this.employeeService.saveEmployees(uploadData).pipe(takeUntil(componentDestroyed(this))).subscribe(
                data => {
                    if (data['code'] === 0) {
                        this.success(MessageEmployee.EmployeeAdded);
                        this.btnDisabled = false;
                    }
                    console.log(data);
                    },
                error => {
                    this.error(error); 
                    this.btnDisabled = false;
                    console.log(error);
                });
            }
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
                            this.storeEmployeeData();
                        }
                        console.log(data);
                    },
                    error=>{
                        this.error(error); 
                        this.btnDisabled = false;
                    }
                );
    }
    
    
    ngOnDestroy(): void {
    }
    
    redirectMainPage(){
        this.router.navigate([this.mainPage]);
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
    
    changePassword($event){
        if(!$event.target.checked){
            this.changedPassword = false;
            this.newEmployeeForm.get('password').disable();
            this.newEmployeeForm.get('confirm_password').disable();
            
            this.render.removeClass(this.password.nativeElement, "form-control-invalid");
            this.render.removeClass(this.confirm_password.nativeElement, "form-control-invalid");
            this.removeValidationFromPwd();
        }else{
            this.changedPassword = true;
            this.newEmployeeForm.get('password').enable();
            this.newEmployeeForm.get('confirm_password').enable();
            this.setValidationOnPwd();
        }
    }
    
}
