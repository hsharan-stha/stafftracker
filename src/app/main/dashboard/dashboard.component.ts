import {Component, OnInit, ViewChild, ElementRef, HostListener, Input} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {CoordinatePoint} from './../../shared/info-card/coordinate-point.model';
import {DataService} from './../../service/data.service';
import {componentDestroyed} from 'src/app/core/takeUntil-function';
import {takeUntil} from 'rxjs/operators';
import {CommService} from "@shared/map/services/comm.service";
import {AppConfigService} from "../../service/AppConfig.service";
import {GeoLocationService} from "../../service/geo-location.service";
import {AlertMessageService} from "../../service/alert-message.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  hideSearchForm = true;
  showPunctual = false;
  showMovement = false;
  showViolators = false;
  showFleetActivityMap = true;
  showSearch = false;
  coordinateList;
  showInfoDetail = false;
  dashboardDisabled = false;
  showMovementForm = false;
  mapHeight;
  isMapShow: boolean = false;
  mapLoader: boolean = false;
  viewTrackingFlag: any = false;
  punvoiloader: boolean = false;
  mnButtom: number = 45;
  innerWidth;
  coordinateDetail: CoordinatePoint[];
  isempvalid: string = "";
  isgrpvalid: string = "";
  isgeovalid: string = "";
  @ViewChild('mapWrapper') mapWrapperView: ElementRef;

  searchForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private appConfigService: AppConfigService,
    public data: DataService,
    public geoLocation: GeoLocationService,
    public commService: CommService,
    public alertService: AlertMessageService,
    public route: Router,
  ) {
    console.log(data);
  }

  ngOnInit() {
    this.initForm();
    this.data.dashboardData
      .pipe(takeUntil(componentDestroyed(this))).subscribe(
      data => {
        this.dashboardDisabled = data;
        this.showFleetActivityMap = true;
        if (this.dashboardDisabled == false) {
          this.hideSearchForm = true;
          this.showPunctual = false;
          this.showMovement = false;
          this.showViolators = false;
          this.showFleetActivityMap = true;
          this.showSearch = false;
          this.coordinateList = [];
          this.showInfoDetail = false;
          this.showMovementForm = false;
          this.initForm();
        }
        this.refreshMap();
      });
    this.refreshMap();
  }

  imageURL(): string {
    return this.appConfigService.config['base_ip'];
  }


  getHeightOfMap() {
    this.innerWidth = window.innerWidth;
    this.isMapShow = false;
    let mapTopPosition = this.mapWrapperView.nativeElement.getBoundingClientRect().top;
    let windowHeight = window.innerHeight;
    let marginBtmSpace = 20;
    let searchBarHeight = (!this.dashboardDisabled) ? 24 : 0;
    let requiredHeight = (windowHeight - mapTopPosition - marginBtmSpace - searchBarHeight - 5);
    // if (requiredHeight > 579) {
    requiredHeight = requiredHeight - 25;
    // }
    this.mapHeight = (requiredHeight > 180) ? requiredHeight + 'px' : 180 + 'px';
    setTimeout(() => {
      this.isMapShow = true;
    }, 20);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.getHeightOfMap();
  }

  initForm() {
    this.searchForm = this.formBuilder.group({
      'employee': ['', Validators.required],
      'group': ['', Validators.required],
      'geozone': ['', Validators.required]
    })
  }


  showSearchForm() {
    this.hideSearchForm = !this.hideSearchForm;
  }

  togglePunctual() {
    this.showPunctual = !this.showPunctual;
    if (this.showPunctual == true) {
      this.showViolators = false;
      this.showSearch = false;
      this.showMovement = false;
      this.hideSearchForm = true;
      this.showInfoDetail = false;
      this.viewTrackingFlag = false;
      this.punvoiloader = true;
    }
    this.refreshMap();
  }

  refreshMap() {
    this.showFleetActivityMap = false;
    setTimeout(() => {
      this.showFleetActivityMap = true;
    }, 0);
    setTimeout(() => {
      this.getHeightOfMap();
    }, 0);
  }

  PunVoiLoader($event) {
    this.punvoiloader = $event;
  }

  toggleMovement() {
    this.showMovement = !this.showMovement;
    if (this.showFleetActivityMap === true) {
      this.showFleetActivityMap = false;
    }
    if (this.showMovement === true) {
      this.showViolators = false;
      this.showSearch = false;
      this.showPunctual = false;
      this.hideSearchForm = true;
      this.showInfoDetail = false;
      this.viewTrackingFlag = false;
    } else {
      setTimeout(() => {
        this.showFleetActivityMap = true;
      }, 0);
    }
    setTimeout(() => {
      this.getHeightOfMap();
    }, 0);
  }

  toggleViolators() {
    this.showViolators = !this.showViolators;
    if (this.showViolators == true) {
      this.showPunctual = false;
      this.showSearch = false;
      this.showMovement = false;
      this.hideSearchForm = true;
      this.showInfoDetail = false;
      this.viewTrackingFlag = false;
      this.punvoiloader = true;
    }
    this.refreshMap();
  }

  toggleSearchMap() {
    this.removeValidators(this.searchForm.controls['employee']);
    this.removeValidators(this.searchForm.controls['group']);
    this.removeValidators(this.searchForm.controls['geozone']);
    this.closeEmpInfoCard();
    this.showFleetActivityMap = false;
    setTimeout(() => {
      this.showFleetActivityMap = true;
    }, 0);
    this.showPunctual = false;
    this.showViolators = false;
    this.hideSearchForm = false;
    this.showMovement = false;
    this.showSearch = !this.showSearch;
    this.viewTrackingFlag = false;
    setTimeout(() => {
      this.getHeightOfMap();
    }, 0);
  }

  toggleFleetActivityMap() {
    this.showFleetActivityMap = false;
  }

  searchEmployee() {
    let employee;
    let group;
    let geozone;
    this.showInfoDetail = false;
    employee = this.searchForm.value.employee;
    group = this.searchForm.value.group;
    geozone = this.searchForm.value.geozone;
    this.coordinateList = [];
    this.getHeightOfMap();
    if (employee.length > 0 || group.length > 0 || geozone.length > 0) {
      this.mapLoader = true;
      if (employee.length > 0) {
        this.isempvalid = "yes";
        this.isgrpvalid = "no";
        this.isgeovalid = "no";
        for (let selectedEmployee of employee) {
          let params = {"msisdn": selectedEmployee.msisdn};
          this.geoLocation.getCurrentLocation(params).pipe(takeUntil(componentDestroyed(this))).subscribe(res => {
            if (res.code === 0) {
              let empItem = {
                lat: Number(res.result.lat),
                lon: Number(res.result.long),
                icon: this.imageURL() + selectedEmployee.icon_url,
                type: "Employee",
                value: selectedEmployee
              };
              this.coordinateList.push(empItem);
            }
          }, err => {
            this.error(err);
          }, () => {
            if (this.coordinateList.length === employee.length) {
              this.setMarkerOnMap();
              this.mapLoader = false;
            }
          });
        }
      } else if (group.length > 0) {
        this.isempvalid = "no";
        this.isgrpvalid = "yes";
        this.isgeovalid = "no";
        let params = {"group_id": group[0].id};
        this.geoLocation.getCurrentLocation(params).pipe(takeUntil(componentDestroyed(this))).subscribe(res => {
          if (res.code === 0) {
            res.result.forEach(ev => {
              let empInfo = {
                position: ev.position,
                emp_name: ev.name,
                msisdn: ev.msisdn
              };
              let val = Object.assign(empInfo, group[0]);
              let groupItem = {
                lat: Number(ev.lat),
                lon: Number(ev.long),
                icon: this.imageURL() + ev.icon_url,
                type: "group",
                value: val
              };
              this.coordinateList.push(groupItem);
            })
          }
        }, err => {
          this.error(err);
        }, () => {
          this.setMarkerOnMap();
          this.mapLoader = false;
        });
      } else if (geozone.length > 0) {
        this.isempvalid = "no";
        this.isgrpvalid = "no";
        this.isgeovalid = "yes";
        let params = {"geozone_id": geozone[0].id};
        this.geoLocation.getCountOfEmployee(params).pipe(takeUntil(componentDestroyed(this))).subscribe(res => {
          if (res.code === 0) {
            let empNum = {emp_num: res.result.cnt};
            let val = Object.assign(empNum, geozone[0]);
            let geozoneItem = {
              lat: Number(geozone[0].latitude),
              lon: Number(geozone[0].longitude),
              icon: '',
              type: "geozone",
              value: empNum
            };
            this.coordinateList.push(geozoneItem);
          }
        }, err => {
          this.error(err);
        }, () => {
          this.setMarkerOnMap();
          this.mapLoader = false;
        });
      }

    } else {
      this.setMarkerOnMap();
      this.setValidators();
    }

  }

  setMarkerOnMap() {
    console.log(this.coordinateList);
    this.commService.setMovementList(this.coordinateList);
  }

  coordinateIconClicked(coordinateDetail) {
    this.coordinateDetail = coordinateDetail;
    this.showInfoDetail = true;
  }

  closeEmpInfoCard() {
    this.showInfoDetail = false;
  }

  sendMsgForEmp() {
    console.log("send message to employee");
  }

  viewTracking(res) {
    let resData = res.toString();
    resData = resData.split('-');
    if (typeof resData[1] === 'undefined') {
      this.toggleMovement();
      this.viewTrackingFlag = resData[0];
    } else {
      this.route.navigate(['main/statistics/geozone-visits/' + resData[0]]);
    }
  }

  ddEmpChanged(data) {
    if (data != "") {
      this.searchForm.controls['group'].setValue("");
      this.searchForm.controls['geozone'].setValue("");
      this.removeValidators(this.searchForm.controls['group']);
      this.removeValidators(this.searchForm.controls['geozone']);
    }
  }

  ddGroupChanged(data) {
    if (data != "") {
      this.searchForm.controls['employee'].setValue("");
      this.searchForm.controls['geozone'].setValue("");
      this.removeValidators(this.searchForm.controls['employee']);
      this.removeValidators(this.searchForm.controls['geozone']);
    }
  }

  ddGeozoneChanged(data) {
    if (data != "") {
      this.searchForm.controls['employee'].setValue("");
      this.searchForm.controls['group'].setValue("");
      this.removeValidators(this.searchForm.controls['employee']);
      this.removeValidators(this.searchForm.controls['group']);
    }
  }

  removeValidators(controlName): void {
    controlName.clearValidators();
    controlName.updateValueAndValidity();
  }

  setValidators(): void {
    this.isempvalid = "no";
    this.isgrpvalid = "no";
    this.isgeovalid = "no";
    let grp = this.searchForm.controls['group'];
    let geo = this.searchForm.controls['geozone'];
    let emp = this.searchForm.controls['employee'];
    grp.setValidators([Validators.required]);
    geo.setValidators([Validators.required]);
    emp.setValidators([Validators.required]);
    grp.updateValueAndValidity();
    geo.updateValueAndValidity();
    emp.updateValueAndValidity();
  }

  error(err): void {
    this.alertService.show({
      message: err.error.result,
      alertType: "error"
    });
    this.mapLoader = false;
    this.setMarkerOnMap();
  }

  setMapLoader($event) {
    if ($event === true) {
      this.refreshMap();
      this.showInfoDetail = false;
    }
    this.mapLoader = $event;
  }

  ngOnDestroy(): void {
  }
}


