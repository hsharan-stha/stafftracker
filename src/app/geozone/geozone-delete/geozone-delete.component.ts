import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { componentDestroyed } from 'src/app/core/takeUntil-function';
import { GeozoneService } from '../service/geozone.service';
import { StaticData } from '../StaticData/staticdata.geozone';
import { MessageGeozone } from '../StaticData/message.geozone';
import {AlertMessageService} from "./../../service/alert-message.service";

@Component({
  selector: 'geozone-delete',
  templateUrl: './geozone-delete.component.html',
  styleUrls: ['./geozone-delete.component.css']
})
export class GeozoneDeleteComponent implements OnInit {
    showConfirmBox: boolean = true;
    private geozoneID: number;
    private DeleteTitle: string = StaticData.DeleteTitle;
    private DeleteWarning: string = MessageGeozone.DeleteWarnMessage;
    private mainPage: string = StaticData.MainPage;
    
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private geozoneService: GeozoneService,
        private alertMessageService: AlertMessageService) { 
          this.route.params.pipe(takeUntil(componentDestroyed(this))).subscribe(params => this.geozoneID = parseInt(params['id']));
    }

    ngOnInit() {
    }
    
    ngOnDestroy(): void {
    }
    
    confirm($event){
        if($event){
            this.geozoneService.remove(this.geozoneID).pipe(takeUntil(componentDestroyed(this))).subscribe(
            data=>{
                if (data['code'] === 0) {
                    this.geozoneService.setNotify(true);
                    this.alertMessageService.show({
                        message: MessageGeozone.GeozoneRemoved,
                        alertType: "success"
                    });
                    this.redirectMainPage();
                }
            },
            err=>{
                this.alertMessageService.show({
                    message: err.error.result,
                    alertType: "error"
                });
            })
        }
    }
    
    cancel($event) {
        if ($event) {
            this.showConfirmBox = false;
            this.redirectMainPage();
        }
    }

    redirectMainPage(): void {
        this.router.navigate([this.mainPage]);
    }


}
