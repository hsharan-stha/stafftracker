import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Router } from '@angular/router';

@Component({
  selector: 'app-get-started-page',
  templateUrl: './get-started-page.component.html',
  styleUrls: ['./get-started-page.component.css']
})
export class GetStartedPageComponent implements OnInit {

    inputFormGroup : FormGroup ;

    colors ;

  constructor(private fb : FormBuilder, private router : Router) { }

  ngOnInit() {

      this.inputFormGroup = this.fb.group({
          name : ["",[Validators.required]]
      });
  }

    get field(){
        return this.inputFormGroup.controls ;
    }

  btnClicked(){
    this.router.navigate(['main']);
  }
  
  hoverC(){

  }

}
