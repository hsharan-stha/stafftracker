import {Component, OnInit, HostListener, ElementRef, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {GetWindowHeightService} from 'src/app/service/get-window-height.service';
import {takeUntil} from 'rxjs/operators';
import {componentDestroyed} from 'src/app/core/takeUntil-function';
import {GeozoneService} from '../service/geozone.service';
import {StaticData} from '../StaticData/staticdata.geozone';

@Component({
  selector: 'geozone-list',
  templateUrl: './geozone-list.component.html',
  styleUrls: ['./geozone-list.component.css']
})
export class GeozoneListComponent implements OnInit {

  searchForm: FormGroup;
  showExpandBtn = true;
  p: number = 1;
  perPageItem = 20;
  collection = [];
  totalRows;
  @ViewChild('geozoneTable') elementView: ElementRef;
  sortingParams;
  sortingField: string = "name";
  sortingOrder: string = "ASC";
  loader: boolean = false;
  hoverCheckBox: boolean = false;

  innerWidth;
  laptopSize: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private getWindowHeightService: GetWindowHeightService,
    private geozoneService: GeozoneService
  ) {
  }

  ngOnInit() {
    this.initForm();
    this.adjustWidth();
    setTimeout(() => {
      this.initTable();
    }, 20);
    this.onDelete();
  }

  initSortingParams(): void {
    this.sortingParams = {
      "order_by": this.sortingField,
      "order_direction": this.sortingOrder
    };
  }

  initTable() {
    this.initSortingParams();
    this.countGeozoneData();

    let tableHeaderHeight = 29
    let tableRowsHeight = 73;
    this.getWindowHeightService.getData(this.elementView, tableHeaderHeight, tableRowsHeight, "geozoneTbl");

    this.getWindowHeightService.windowSizeChanged.pipe(takeUntil(componentDestroyed(this))).subscribe(
      value => {
        this.perPageItem = value.rows;
        this.getGeozoneData();
      }
    );
  }

  countGeozoneData() {
    let params = {
      "limit": 1,
      "page_number": 0
    };
    let filterParams = this.getFilterParams();
    if (filterParams != null) {
      params['filters'] = filterParams;
    }
    this.getGeozoneList(params);
  }

  getGeozoneData() {
    let params = {
      "limit": this.perPageItem,
      "page_number": this.p,
      "order_by": this.sortingParams.order_by,
      "order_direction": this.sortingParams.order_direction
    }

    let filterParams = this.getFilterParams();
    if (filterParams != null) {
      params['filters'] = filterParams;
    }
    this.loader = true;
    this.getGeozoneList(params);
  }

  getGeozoneList(params) {
    this.geozoneService.getAll(params).pipe(takeUntil(componentDestroyed(this))).subscribe(
      data => {
        if (typeof data === "number") {
          this.totalRows = data;
          return true;
        }
        this.collection = data;
        this.loader = false;
      },
      error => {
        console.log(error);
      }
    )
  }

  findGeozone() {
    if (this.searchForm.valid) {
      this.countGeozoneData();
      this.getGeozoneData();
    }
  }

  getFilterParams() {
    if (this.searchForm.valid) {
      let filterParams = {};

      if (this.searchForm.value.name != "" && this.searchForm.value.name != null) {
        filterParams["name"] = this.searchForm.value.name;
      }
      if (this.searchForm.value.address != "" && this.searchForm.value.address != null) {
        filterParams["address"] = this.searchForm.value.address;
      }

      return filterParams;
    }
    return null;
  }

  expandTable() {
    this.showExpandBtn = false;
  }

  pageChanged(pageNumber): void {
    this.p = pageNumber;
    this.getGeozoneData();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.adjustWidth();
  }

  adjustWidth(): void {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 1100) {
      this.laptopSize = true;
    } else {
      this.laptopSize = false;
    }
  }

  initForm() {
    this.searchForm = this.formBuilder.group({
      'name': ['', [Validators.minLength(3)]],
      'address': ['', [Validators.minLength(3)]]
    })
  }

  addGeozone() {
    this.router.navigate([StaticData.MainPage + '/create']);
  }

  editGeozoneInformation(id) {
    this.router.navigate([StaticData.MainPage + id]);
  }

  deleteGeozone(id) {
    this.router.navigate([StaticData.MainPage + "/delete/" + id]);
  }

  onDelete(): void {
    this.geozoneService.getNotify().pipe(takeUntil(componentDestroyed(this))).subscribe(
      (data) => {
        if (data === true) {
          this.countGeozoneData();
          this.getGeozoneData();
        }
      }
    )
  }

  sortItems($event): any {
    this.sortingParams = {
      "order_by": $event.order_by,
      "order_direction": $event.order_direction
    };
    this.getGeozoneData();
  }

//    findGeozone() {
//      if (this.searchForm.valid) {
//        let filterKey = this.searchForm.value.name.toLowerCase();
//        let filterAddress = this.searchForm.value.address;
//        this.filteredGeozones = this.geozones.filter(function(geozone){
//          return geozone.name.toLowerCase().indexOf(filterKey) > -1 && (geozone.address.toLowerCase().indexOf(filterAddress) > -1) ;
//        });
//      } else {
//        this.filteredGeozones = this.geozones;
//      }
//    }

  ngOnDestroy(): void {
  }

  setCheckBoxHover($event) {
    this.hoverCheckBox = $event;
  }
}
