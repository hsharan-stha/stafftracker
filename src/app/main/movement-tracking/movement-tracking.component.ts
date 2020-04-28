import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  ViewChild,
  HostListener,
  ElementRef, OnChanges
} from '@angular/core';
import {Validators, FormGroup, FormBuilder} from '@angular/forms';
import {CommService} from '@shared/map/services/comm.service';
import {GeoLocationService} from "../../service/geo-location.service";
import {AlertMessageService} from "../../service/alert-message.service";
import {AppConfigService} from "../../service/AppConfig.service";
import {takeUntil} from "rxjs/operators";
import {componentDestroyed} from "../../core/takeUntil-function";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'movement-tracking',
  templateUrl: './movement-tracking.component.html',
  styleUrls: ['./movement-tracking.component.css']
})
export class MovementTrackingComponent implements OnInit, OnChanges {
  // @Input() showTopPunctualParam: boolean;
  @Input() viewTrackingFlag: any;
  // showPunctualList = false;
  @Output() buttonClicked: EventEmitter<string> = new EventEmitter();
  mapHeight;
  @ViewChild('mapWrapper') mapWrapperView: ElementRef;
  viewMessage: string = "View employee information";
  isMapShow: boolean = false;
  showActivityMap: boolean = true;
  innerWidth;
  hideSearchForm = false;
  trackMovementForm: FormGroup;
  trackedMovements: boolean = false;
  showMovementDetails: boolean = false;
  mapLoader: boolean = false;
  setScroll: boolean = false;
  addSeideBarHeight: boolean = false;
  top: number = 71;
  isvalid: string = "";
  movementLists: any;
  recentMoment: any;
  coordinateLists = [];

  constructor(
    private formBuilder: FormBuilder,
    private commService: CommService,
    public geoLocation: GeoLocationService,
    public alertService: AlertMessageService,
    public appConfigService: AppConfigService,
    public datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    this.checkedViewTracking();
    this.initForm();
    setTimeout(() => {
      this.getHeightOfMap();
    }, 20);
  }


  imageURL(): string {
    return this.appConfigService.config['base_ip'];
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.getHeightOfMap();
  }

  // togglePunctualList() {
  //   this.showPunctualList = !this.showPunctualList;
  //   this.buttonClicked.emit();
  // }

  ngOnChanges(changes: SimpleChanges) {
    // if (typeof changes.showTopPunctualParam !== "undefined") {
    //   if (!changes.showTopPunctualParam.currentValue) {
    //     this.showPunctualList = false;
    //   }
    // }
  }

  checkedViewTracking() {
    if (this.viewTrackingFlag) {
      this.showSearchForm();
      let params = {
        "msisdn": this.viewTrackingFlag,
        "start_date": this.datePipe.transform(new Date(), "yyyy-MM-dd")
      };
      this.trackedLocation(params);
    }
  }

  // viewEmployeeInformation() {
  //   console.log("view employee information");
  // }
  //
  // sendMessageToEmployee() {
  //   console.log("send message to employee");
  // }

  initForm() {
    const todayYear = Number(this.datePipe.transform(new Date(), 'yyyy'));
    const todayMonth = Number(this.datePipe.transform(new Date(), 'MM'));
    const todayDay = Number(this.datePipe.transform(new Date(), 'dd'));

    this.trackMovementForm = this.formBuilder.group({
      'employee': ['', Validators.required],
      'date': [{year: todayYear, month: todayMonth, day: todayDay}, Validators.required],
    })
  }

  getTrackedMovements() {
    this.coordinateLists = [];
    if (this.trackMovementForm.valid) {
      this.getHeightOfMap();
      this.isvalid = "yes";
      let employee = this.trackMovementForm.value.employee;
      let date = this.trackMovementForm.value.date;
      let params = {
        "msisdn": employee[0].msisdn,
        "start_date": date.year + "-" + date.month + "-" + date.day
      };
      this.trackedLocation(params);
    } else {
      this.isvalid = "no";
      console.log("invalid form");
    }
  }

  trackedLocation(params) {
    this.mapLoader = true;
    this.commService.setCircleRadius(80);
    this.commService.setColorCode('#2E5BFF');
    this.geoLocation.getPeriodicLocation(params).pipe(takeUntil(componentDestroyed(this))).subscribe(res => {
      this.coordinateLists = res;
      this.movementLists = res;
      this.trackedMovements = true;
    }, err => {
      this.error(err);
    }, () => {
      this.setMarkerOnMap();
      this.mapLoader = false;
    });
  }

  exportData() {
    console.log("Export movement track data");
  }

  getHeightOfMap() {
    this.innerWidth = window.innerWidth;
    
    this.isMapShow = false;
    this.trackedMovements = false;
    let mapTopPosition = this.mapWrapperView.nativeElement.getBoundingClientRect().top;
    let windowHeight = window.innerHeight;
    let marginBtmSpace = 20;
    let searchBarHeight = 24;
    let requiredHeight = (windowHeight - mapTopPosition - marginBtmSpace - searchBarHeight - 5);
    // if (requiredHeight > 579) {
    requiredHeight = requiredHeight - 25;
    // }
    this.mapHeight = (requiredHeight > 180) ? requiredHeight + 'px' : 180 + 'px';
    console.log(windowHeight, this.mapHeight);
    setTimeout(() => {
      this.isMapShow = true;
    }, 20);
  }

  // toggleActivityMap() {
  //   this.showActivityMap = false;
  // }

  getInputChange(): void {
    this.trackedMovements = false;

  }

  error(err): void {
    this.alertService.show({
      message: err.error.result,
      alertType: "error"
    });
    this.mapLoader = false;
    this.movementLists = [];
    this.trackedMovements = false;
  }

  setOverlay(data, that) {
    let posdata = (that.srcElement.getBoundingClientRect().top);
    let scrWidth = window.innerWidth;
    let inipos = scrWidth <= 991 ? 543 : 411;
    this.top = (this.top) + (posdata - inipos);
    this.setScroll = true;
    this.recentMoment = data;
  }

  unsetOverlay() {
    this.recentMoment = null;
    this.top = 71;
    this.setScroll = false;
  }

  setMarkerOnMap() {
    this.commService.setMovementList(this.coordinateLists);
  }

  showSearchForm() {
    this.hideSearchForm = !this.hideSearchForm;
    this.addSeideBarHeight = !this.addSeideBarHeight;
  }

  ngOnDestroy(): void {
  }

}
