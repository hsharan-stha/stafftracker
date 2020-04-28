import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {GetWindowHeightService} from 'src/app/service/get-window-height.service';
import {takeUntil} from 'rxjs/operators';
import {componentDestroyed} from 'src/app/core/takeUntil-function';
import {DatePipe} from "@angular/common";
import {GeozoneService} from "../../geozone/service/geozone.service";
import {GeozoneVisitsService} from "./service/geozone-visits.service";
import {ActivatedRoute} from "@angular/router";
import {AppConfigService} from "../../service/AppConfig.service";
import {exportCSV} from "../../core/export";

@Component({
  selector: 'geozone-visits',
  templateUrl: './geozone-visits.component.html',
  styleUrls: ['./geozone-visits.component.css']
})
export class GeozoneVisitsComponent implements OnInit {
  geozoneVisitForm: FormGroup;
  p: number = 1;
  geozone_id: any;
  perPageItem = 20;
  totalRows;
  count = 0;
  @ViewChild('reportTable') elementView: ElementRef;
  geozoneVisits = [];
  geozone;
  isSubmitted: boolean = false;
  loader: boolean = false;
  exportClicked: boolean = false;
  dataExported: boolean = false;
  sortingParams;
  fieldName: string = "created";
  searchBtnDisabled: boolean = false;
  exportBtnDisabled: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private getWindowHeightService: GetWindowHeightService,
    private datePipe: DatePipe,
    private geozoneService: GeozoneService,
    private service: GeozoneVisitsService,
    private route: ActivatedRoute,
    private appConfigService: AppConfigService,
  ) {
    this.route.params.pipe(takeUntil(componentDestroyed(this))).subscribe(params => this.geozone_id = parseInt(params['id']));
  }

  ngOnInit() {
    this.initForm();
    this.initSortingParams();
    setTimeout(() => {
      this.initTable();
    }, 20);
    this.getGeozone();
  }

  imageURL(): string {
    return this.appConfigService.config['base_ip'];
  }

  initForm() {
    const todayYear = Number(this.datePipe.transform(new Date(), 'yyyy'));
    const todayMonth = Number(this.datePipe.transform(new Date(), 'MM'));
    const todayDay = Number(this.datePipe.transform(new Date(), 'dd'));
    this.geozoneVisitForm = this.formBuilder.group({
      'fromDate': [{year: todayYear, month: todayMonth, day: todayDay}, Validators.required],
      'toDate': [{year: todayYear, month: todayMonth, day: todayDay}, Validators.required],
      'geozone': ['', Validators.required],
    });
  }

  initSortingParams(): void {
    this.sortingParams = {
      "order_by": this.fieldName,
      "order_direction": "ASC"
    };
  }

  getGeozone() {
    let params = {
      "page_number": 1,
      "order_by": "name",
      "order_direction": "ASC"
    };
    this.geozoneService.getAll(params).pipe(takeUntil(componentDestroyed(this))).subscribe(
      res => {
        this.geozone = res;
      }
    );
  }

  initTable() {
    let tableHeaderHeight = 29;
    let tableRowsHeight = 75;
    this.getWindowHeightService.getData(this.elementView, tableHeaderHeight, tableRowsHeight, "geozoneVisitReport");
    this.getWindowHeightService.windowSizeChanged.pipe(takeUntil(componentDestroyed(this))).subscribe(
      value => {
        this.perPageItem = value.rows;
        if (this.geozone_id && !this.dataExported) {
          // this.getCurrentGeozoneVisits();
          this.countCurrentGeozoneVisits();
        } else {
          this.getGeozonevisitList();
        }
      }
    );
  }

  getCurrentGeozoneVisits() {
    let params = this.getCurrentFormData();
    let extraParams = {
      'page_number': this.p,
      'limit': this.perPageItem,
      "order_by": this.fieldName,
      "order_direction": "ASC"
    };
    this.triggerGeozoneData(Object.assign(params, extraParams));
  }

  countCurrentGeozoneVisits() {
    let params = this.getCurrentFormData();
    let extraParams = {
      'page_number': 0,
      'limit': 1
    }
    this.geozoneVisitForm.patchValue({
      geozone: this.geozone_id
    });
    this.triggerGeozoneData(Object.assign(params, extraParams));
  }


  getGeozonevisitList() {
    if (this.geozoneVisitForm.valid) {
      let params = this.getFormData();
      let extraParams = {
        'page_number': this.exportClicked ? 1 : this.p,
        'limit': this.exportClicked ? this.count : this.perPageItem,
        'order_by': this.sortingParams.order_by,
        'order_direction': this.sortingParams.order_direction,
        'for_export': this.exportClicked ? 1 : 0
      }
      this.triggerGeozoneData(Object.assign(params, extraParams));
    } else {
      this.totalRows = 0;
    }
  }

  getFormData(): any {
    let geozone_id = this.geozoneVisitForm.value.geozone;
    let fromDateObj = this.geozoneVisitForm.value.fromDate;
    let toDateObj = this.geozoneVisitForm.value.toDate;
    let date_from = this.datePipe.transform(new Date(fromDateObj['year'], fromDateObj['month'] - 1, fromDateObj['day']), "yyyy-MM-dd HH:mm:ss");
    let date_to = this.datePipe.transform(new Date(toDateObj['year'], toDateObj['month'] - 1, toDateObj['day']), "yyyy-MM-dd HH:mm:ss");
    let params = {
      'date_from': date_from,
      'date_to': date_to,
      'geozone_id': geozone_id
    };
    return params;
  }

  getCurrentFormData(): any {
    let params = {
      'date_from': this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss"),
      'date_to': this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss"),
      'geozone_id': this.geozone_id
    };
    return params;
  }

  getGeozonevisitBtnClicked() {
    this.isSubmitted = true;
    this.forExpandAndPagination();
  }

  triggerGeozoneData(params) {
    this.loader = true;
    this.service.getAll(params).pipe(takeUntil(componentDestroyed(this))).subscribe(
      (res: any) => {
        if (typeof res === "number") {
          this.count = res;
          if (this.geozone_id) {
            this.getCurrentGeozoneVisits();
          } else {
            this.getGeozonevisitList();
          }
          return false;
        } else if (params['for_export'] === 1) {
          this.exportClicked = false;
          this.exportBtnDisabled = false;
          exportCSV('GeozoneVisits.csv', res);
          this.dataExported = true;
        } else {
          this.geozoneVisits = res;
          this.totalRows = this.count;
        }
        this.loader = false;
        this.geozone_id = null;
        
        this.searchBtnDisabled = false;
      }
    );
  }

  forExpandAndPagination() {
    if (this.geozoneVisitForm.valid) {
        this.searchBtnDisabled = true;
      let params = this.getFormData();
      let extraParams = {
        'page_number': 0,
        'limit': 1
      };
      this.triggerGeozoneData(Object.assign(params, extraParams));
    } else {
      this.totalRows = 0;
    }
  }

  sortItems($event): any {
    this.sortingParams = {
      "order_by": $event.order_by,
      "order_direction": $event.order_direction
    };
    this.getGeozonevisitList();
  }

  pageNumber($event): void {
    this.p = $event;
    this.getGeozonevisitList();
  }

  exportData() {
    if (this.geozoneVisitForm.valid) {
        this.exportBtnDisabled = true;
      this.exportClicked = true;
      this.getGeozonevisitList();
    }
  }


  ngOnDestroy(): void {
  }
}
