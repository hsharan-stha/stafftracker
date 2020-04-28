import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  ElementRef,
  ViewChild, OnChanges
} from '@angular/core';
import {GetWindowHeightService} from 'src/app/service/get-window-height.service';
import {filter, takeUntil} from 'rxjs/operators';
import {componentDestroyed} from 'src/app/core/takeUntil-function';
import {PunctualEmployeeService} from "./service/punctual-employee.service";
import {AppConfigService} from "../../service/AppConfig.service";
import {GeoLocationService} from "../../service/geo-location.service";
import {CommService} from "@shared/map/services/comm.service";
import {AlertMessageService} from "../../service/alert-message.service";
import {StaticData} from "../../employee/StaticData/staticdata.employee";
import {Router} from "@angular/router";

@Component({
  selector: 'app-punctual-employee',
  templateUrl: './punctual-employee.component.html',
  styleUrls: ['./punctual-employee.component.css']
})
export class PunctualEmployeeComponent implements OnInit, OnChanges {
  @Input() showTopPunctualParam: boolean;
  @Input() loading: boolean;
  showPunctualList = false;
  loader: boolean = false;
  loaderTop: boolean = false;
  @Output() buttonClicked: EventEmitter<string> = new EventEmitter();
  @Output() loadMap: EventEmitter<any> = new EventEmitter();
  @Output() mapLoader: EventEmitter<boolean> = new EventEmitter();
  @Output() topLoaderPunVoi: EventEmitter<boolean> = new EventEmitter();
  viewMessage: string = "View employee information";
  p: number = 1;
  perPageItem = 20;
  totalRows;
  $windowSizeChanged;
  punctualEmployees;
  limitedPunctualEmployees;
  countRow: number;
  table;
  coordinateList;
  selectedMsisdn = '';

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
    let tableHeaderHeight = 0;
    let tableRowsHeight = 73;
    this.$windowSizeChanged = this.getWindowHeightService.getData(this.elementView, tableHeaderHeight, tableRowsHeight, "punctualEmpReport");
    this.table = this.getWindowHeightService.windowSizeChanged.pipe(takeUntil(componentDestroyed(this))).subscribe(
      value => {
        this.perPageItem = value.rows;
        this.getPunctualEmpData();
      }
    );
  }

  getPunctualEmployees(params): void {
    this.service.getAll(params).pipe(takeUntil(componentDestroyed(this))).subscribe(
      res => {
        if (typeof res === "number") {
          this.countRow = res;
          this.getLimitedPunctualEmpData();
          return false;
        }
        if (params.limited === true) {
          this.limitedPunctualEmployees = res.filter(x => x.num <= 4);
          this.loaderTop = false;
          this.topLoaderPunVoi.emit(false);
          if (this.loaderTop === false && this.limitedPunctualEmployees.length > 0) {
            this.loadPunctualMap();
          }
        } else {
          this.punctualEmployees = res;
          this.loader = false;
        }
        if (typeof this.table !== 'undefined') {
          this.table.unsubscribe();
        }
      }
    )
  }

  loadPunctualMap() {
    this.loadMap.emit();
  }

  forExpandAndPagination() {
    let params = {
      "limit": 1,
      "page_number": 0
    };
    this.getPunctualEmployees(params);
  }

  getPunctualEmpData() {
    this.loader = true;
    let params = {
      "page_number": this.p,
      "limit": this.perPageItem,
      "order_by": "punctual_percent",
      "order_direction": "DESC"
    };
    this.getPunctualEmployees(params);
  }

  getLimitedPunctualEmpData() {
    let params = {
      "page_number": 1,
      "limit": 4,
      "order_by": "punctual_percent",
      "order_direction": "DESC",
      "limited": true
    };
    this.getPunctualEmployees(params);
  }

  pageNumber($event): void {
    this.p = $event;
    this.getPunctualEmpData();
  }

  togglePunctualList() {
    setTimeout(() => {
      this.initTable();
    }, 20);
    this.showPunctualList = !this.showPunctualList;
    this.selectedMsisdn = '';
    this.buttonClicked.emit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (typeof changes.showTopPunctualParam !== 'undefined') {
      if (!changes.showTopPunctualParam.currentValue) {
        this.showPunctualList = false;
        this.limitedPunctualEmployees = null;
      } else {
        this.loaderTop = true;
        this.selectedMsisdn = '';
        this.forExpandAndPagination();
      }
    }
  }


  getLocation(value): void {
    console.log(value);
    this.showPunctualList = false;
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
