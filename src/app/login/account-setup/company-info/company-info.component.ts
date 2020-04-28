import { Component, OnInit, Output, EventEmitter,HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { KeyCode } from './../../key-code.model';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.css']
})
export class CompanyInfoComponent implements OnInit {
    state$;
    companyInfoForm: FormGroup;
    fileData: File;
    @Output() nextClicked: EventEmitter<any> = new EventEmitter();
    @Output() backClicked: EventEmitter<any> = new EventEmitter();
    constructor(private formBuilder:FormBuilder) { }
    uploadData;

    ngOnInit() {
      this.initForm();
    }
  
    initForm(){
        this.companyInfoForm = this.formBuilder.group({
            'companyName' : ['',[Validators.required]],
            'image':['']
        });
    }
  
    btnBackClicked(){
        this.backClicked.emit();
        //this.router.navigate(['account-setup/account-info']);
    } 
  
    btnNextClicked(){
        if(this.companyInfoForm.valid){
            if(this.companyInfoForm.get('image').value==""){
                this.uploadData = new FormData();
                this.uploadData.append('image', "");
                this.uploadData.append('companyName', this.companyInfoForm.get('companyName').value);
            }
            this.nextClicked.emit(this.uploadData);
        }
        //this.router.navigate(['account-setup/schedule']);
    }
    onImageChange($event){
        this.fileData = <File>$event.file;
        
        this.uploadData = new FormData();
        this.uploadData.append('image', this.fileData);
        this.uploadData.append('companyName', this.companyInfoForm.get('companyName').value);
        
    }
    
    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
      console.log(event);

      if(event.keyCode=== KeyCode.ENTER_KEY){
          this.btnNextClicked();
      }
    }
}
