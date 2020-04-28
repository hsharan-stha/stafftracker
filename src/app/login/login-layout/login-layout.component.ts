import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { AccountSetupService } from '../account-setup/account-setup.service';
import { componentDestroyed } from 'src/app/core/takeUntil-function';

@Component({
  selector: 'app-login-layout',
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.css']
})
export class LoginLayoutComponent implements OnInit {

    isGeozones : boolean = false ;
    isMapShow: boolean = false;

  constructor(
      private router : Router,
      private accSetupService: AccountSetupService
  ) { }

    ngOnInit() {
        this.accSetupService.getMessage()
        .pipe(takeUntil(componentDestroyed(this))).subscribe(
                data=>{
                    this.isGeozones=data;
                    setTimeout(() => {
                        this.isMapShow = true;
                    }, 20);
                }
            );
            
         
    }
    /**
     * Find if url have add segment or not
     *
     * @param url string
     * @returns {boolean}
     */
    ngOnDestroy(){}
}
