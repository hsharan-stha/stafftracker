import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef
} from '@angular/core';
import {GetWindowHeightService} from 'src/app/service/get-window-height.service';
import {filter, takeUntil} from 'rxjs/operators';
import {componentDestroyed} from 'src/app/core/takeUntil-function';
import {PunctualEmployeeService} from "../punctual-employee/service/punctual-employee.service";
import {AppConfigService} from "../../service/AppConfig.service";
import {GeoLocationService} from "../../service/geo-location.service";
import {CommService} from "@shared/map/services/comm.service";
import {AlertMessageService} from "../../service/alert-message.service";
import {StaticData} from "../../employee/StaticData/staticdata.employee";
import {Router} from "@angular/router";

@Component({
  selector: 'app-violating-employee',
  templateUrl: './violating-employee.component.html',
  styleUrls: ['./violating-employee.component.css']
})
export class ViolatingEmployeeComponent implements OnInit, OnChanges {
  @Input() showTopViolators: boolean;
  @Input() loading: boolean;
  showViolatorsList = false;
  @Output() buttonClicked: EventEmitter<string> = new EventEmitter();
  @Output() loadMap: EventEmitter<any> = new EventEmitter();
  @Output() mapLoader: EventEmitter<boolean> = new EventEmitter();
  @Output() topLoaderPunVoi: EventEmitter<boolean> = new EventEmitter();
  viewMessage: string = "View employee information";
  p: number = 1;
  perPageItem = 20;
  totalRows;
  $windowSizeChanged;
  loader: boolean = false;
  loaderTop: boolean = false;
  limitedViolatingEmployees;
  countRow: number;
  violatingEmployees;
  table;
  selectedMsisdn = '';
  coordinateList;
  @ViewChild('employeeTable') elementView: ElementRef;

  constructor(private getWindowHeightService: GetWindowHeightService,
              private service: PunctualEmployeeService,
              private appConfigService: AppConfigService,
              private geoLocation: GeoLocationService,
              private commService: CommService,
              private router: Router,
              private alertService: AlertMessageService
  ) {

  }

  ngOnInit() {
  }

  imageURL(): string {
    return this.appConfigService.config['base_ip'];
  }

  errorHandler($event) {
    $event.target.src = "assets/icons/blue_user.svg";
  }

  initTable() {
    let tableHeaderHeight = 0
    let tableRowsHeight = 73;
    this.$windowSizeChanged = this.getWindowHeightService.getData(this.elementView, tableHeaderHeight, tableRowsHeight, "violatingEmpReport");
    this.table = this.getWindowHeightService.windowSizeChanged.pipe(takeUntil(componentDestroyed(this))).subscribe(
      value => {
        this.perPageItem = value.rows;
        this.getViolatingEmpData();
      }
    );
  }

  getViolatingEmpData() {
    this.loader = true;
    let params = {
      "page_number": this.p,
      "limit": this.perPageItem,
      "order_by": "punctual_percent",
      "order_direction": "ASC"
    };
    this.getViolatingEmployees(params);
  }

  getViolatingEmployees(params): void {
    this.service.getAll(params).pipe(takeUntil(componentDestroyed(this))).subscribe(
      res => {
        if (typeof res === "number") {
          this.countRow = res;
          this.getLimitedViolatingEmpData();
          return false;
        }
        if (params.limited === true) {
          this.limitedViolatingEmployees = res.filter(x => x.num <= 4);
          this.loaderTop = false;
          this.topLoaderPunVoi.emit(false);
          if (this.loaderTop === false && this.limitedViolatingEmployees.length > 0) {
            this.loadViolatingMap();
          }
        } else {
          this.violatingEmployees = res;
          this.loader = false;
        }
        if (typeof this.table !== 'undefined') {
          this.table.unsubscribe();
        }
      }
    )
  }

  getLimitedViolatingEmpData() {
    let params = {
      "page_number": 1,
      "limit": 4,
      "order_by": "punctual_percent",
      "order_direction": "ASC",
      "limited": true
    };
    this.getViolatingEmployees(params);
  }

  loadViolatingMap() {
    this.loadMap.emit();
  }

  toggleViolatorsList() {
    setTimeout(() => {
      this.initTable();
    }, 20);
    this.showViolatorsList = !this.showViolatorsList;
    this.selectedMsisdn = '';
    this.buttonClicked.emit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (typeof changes.showTopViolators !== 'undefined') {
      if (!changes.showTopViolators.currentValue) {
        this.showViolatorsList = false;
        this.limitedViolatingEmployees = null;
      } else {
        this.loaderTop = true;
        this.selectedMsisdn = '';
        this.forExpandAndPagination();
      }
    }
  }

  forExpandAndPagination() {
    let params = {
      "limit": 1,
      "page_number": 0
    };
    this.getViolatingEmployees(params);
  }

  pageNumber($event): void {
    this.p = $event;
    this.getViolatingEmpData();
  }

  getLocation(value): void {
    console.log(value);
    this.showViolatorsList = false;
    this.mapLoader.emit(true);
    this.coordinateList = [];
    let params = {"msisdn": value.msisdn};
    this.selectedMsisdn = value.msisdn;
    this.geoLocation.getCurrentLocation(params).pipe(takeUntil(componentDestroyed(this))).subscribe(res => {
      console.log(res);
      if (res.code === 0) {
        this.commService.setCircleRadius(80);
        this.commService.setColorCode('#2E5BFF');
        let item = {
          lat: Number(res.result.lat),
          lon: Number(res.result.long),
          icon: this.imageURL() + value.icon_url,
          type: "Employee",
          value: value
        };
        this.coordinateList[0] = item;
      }
    }, err => {
      this.error(err);
    }, () => {
      this.setMarkerOnMap();
    });
  }

  error(err) {
    this.alertService.show({
      message: err.error.result,
      alertType: "error"
    });
    this.setMarkerOnMap();

  }

  setMarkerOnMap() {
    this.mapLoader.emit(false);
    this.commService.setMovementList(this.coordinateList);
  }

  viewEmployeeInformation(id) {
    this.router.navigate([StaticData.MainPage + id]);
    console.log("view employee information");
  }

  sendMessageToEmployee() {
    console.log("send message to employee");
  }

  ngOnDestroy(): void {
  }


}
