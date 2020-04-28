import {Component, OnInit, HostListener, ElementRef, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {EmployeeService} from '../service/employee.service';
import {EmployeeTblModel} from '../model/employee.model';

import {GetWindowHeightService} from 'src/app/service/get-window-height.service';

import {takeUntil} from 'rxjs/operators';
import {componentDestroyed} from 'src/app/core/takeUntil-function';
import {StaticData} from '../StaticData/staticdata.employee';
import {PositionService} from 'src/app/position/service/position.service';
import {GroupService} from 'src/app/group/service/group.service';
import {HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  empSearchForm: FormGroup;
  empGroupList = [];
  empPositionList = [];
  innerWidth;
  laptopSize: boolean = false;
  isMoreGroupDataExists: boolean = true;
  isMorePositionDataExists: boolean = true;
  p: number = 1;
  pageNumForGrp: number = 1;
  pageNumForPos: number = 1;
  collection = [];
  showExpandBtn = true;
  perPageItem = 20;
  totalRows;
  @ViewChild('employeeTable') elementView: ElementRef;
  sortingParams;
  sortingField: string = "name";
  sortingOrder: string = "ASC";
  BASEIPURL: string;
  loader: boolean = false;
  hoverCheckBox: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private employeeService: EmployeeService,
    private getWindowHeightService: GetWindowHeightService,
    private positionService: PositionService,
    private groupService: GroupService) {
  }

  ngOnInit() {
    this.initSearchForm();
    this.adjustWidth();
    this.getGroupList();
    this.getPositionList();
    setTimeout(() => {
      this.initTable();
    }, 20);
    this.onDelete();
    this.BASEIPURL = this.employeeService.getBaseIPURL();
  }

  initSortingParams(): void {
    this.sortingParams = {
      "order_by": this.sortingField,
      "order_direction": this.sortingOrder
    };
  }

  initTable() {
    this.initSortingParams();
    this.countEmployeeData();

    let tableHeaderHeight = 42
    let tableRowsHeight = 73;
    this.getWindowHeightService.getData(this.elementView, tableHeaderHeight, tableRowsHeight, "empTable");

    this.getWindowHeightService.windowSizeChanged.pipe(takeUntil(componentDestroyed(this))).subscribe(
      value => {
        this.perPageItem = value.rows;
        this.getEmployeeData();
      }
    );
  }

  onDelete(): void {
    this.employeeService.getNotify().pipe(takeUntil(componentDestroyed(this))).subscribe(
      (data) => {
        if (data === true) {
          this.countEmployeeData();
          this.getEmployeeData();

        }
      }
    )
  }

  countEmployeeData() {
    let params = {
      "limit": 1,
      "page_number": 0
    };
    let filterParams = this.getFilterParams();
    if (filterParams != null) {
      params['filters'] = filterParams;
    }
    this.getEmployeesList(params);
  }

  getEmployeeData() {
    let params = {
      "limit": this.perPageItem,
      "page_number": this.p,
      "order_by": this.sortingParams.order_by,
      "order_direction": this.sortingParams.order_direction
    };
    let filterParams = this.getFilterParams();
    if (filterParams != null) {
      params['filters'] = filterParams;
    }
    this.loader = true;
    this.getEmployeesList(params);
  }

  getEmployeesList(params) {
    this.employeeService.getEmployees(params).pipe(takeUntil(componentDestroyed(this))).subscribe(data => {
      if (typeof data === "number") {
        this.totalRows = data;
        console.log(this.totalRows);
        return true;
      }
      this.collection = data;
      this.loader = false;
    }, error => console.log(error));

  }

  expandTable() {
    this.showExpandBtn = false;
  }

  pageChanged(pageNumber): void {
    this.p = pageNumber;
    this.getEmployeeData();
  }

  ngOnDestroy(): void {
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

  // getPositionList() {
  //   let tableParam = {
  //     "limit": 6,
  //     "page_number": 1,
  //     "order_by": 'name',
  //     "order_direction": "ASC"
  //   };
  //   this.positionService.getAll(tableParam).pipe(takeUntil(componentDestroyed(this))).subscribe(
  //     data => {
  //       this.empPositionList = data;
  //       console.log(data);
  //     },
  //     error => {
  //       console.log(error);
  //     });
  // }

  getPositionList(): void {
    let params = {
      "limit": 12,
      "page_number": this.pageNumForPos,
      "order_by": "name",
      "order_direction": "ASC"
    };
    console.log(params);
    if (this.isMorePositionDataExists) {
      let listfilteredPosition = [];
      this.positionService.getAll(params).pipe(takeUntil(componentDestroyed(this))).subscribe(
        data => {
          listfilteredPosition = data;
        }, (err) => {
          console.log(err);
          // this.error(err);
        },
        () => {
          if (listfilteredPosition.length > 0) {
            for (let i = 0; i < listfilteredPosition.length; i++) {
              this.empPositionList.push(listfilteredPosition[i]);
            }
          }
          if (listfilteredPosition.length < 12) {
            this.isMorePositionDataExists = false;
          }
        }
      );
    }

  }


  // getGroupList() {
  //   let tableParam = {
  //     "page_number": 1,
  //     "order_by": 'name',
  //     "order_direction": "ASC"
  //   };
  //   this.groupService.getAll(tableParam).pipe(takeUntil(componentDestroyed(this))).subscribe(
  //     data => {
  //       this.empGroupList = data;
  //       console.log(data);
  //     },
  //     error => {
  //       console.log(error);
  //     });
  // }

  getGroupList(): void {
    let params = {
      "limit": 12,
      "page_number": this.pageNumForGrp,
      "order_by": "name",
      "order_direction": "ASC"
    };
    console.log(params);
    if (this.isMoreGroupDataExists) {
      let listfilteredGroup = [];
      this.groupService.getAll(params).pipe(takeUntil(componentDestroyed(this))).subscribe(
        data => {
          listfilteredGroup = data;
        }, (err) => {
          console.log(err);
          // this.error(err);
        },
        () => {
          if (listfilteredGroup.length > 0) {
            for (let i = 0; i < listfilteredGroup.length; i++) {
              this.empGroupList.push(listfilteredGroup[i]);
            }
          }
          if (listfilteredGroup.length < 12) {
            this.isMoreGroupDataExists = false;
          }
        }
      );
    }

  }

  addNewEmployee() {
    this.router.navigate([StaticData.MainPage + '/create']);
  }

  viewEmployeeInformation(id) {
    this.router.navigate([StaticData.MainPage + id]);
  }

  sendMessageToEmployee() {
    console.log("send message to employee");
  }

  deleteEmployee(id) {
    this.router.navigate([StaticData.MainPage + "/delete/" + id]);
  }

  getColorCode(currentStatus) {

    switch (currentStatus) {
      case 'TRACKED':
        return '#33AC2E';
      case 'REJECTED':
        return '#D63649';
      case 'PENDING':
        return '#B0BAC9';
      default:
        return "#B0BAC9";
    }
  }

  private errorImage = false;

  errorImgHandler(event) {
    event.target.src = "assets/icons/blue_user.svg";
    event.target.classList.add("img-error");
  }

  initSearchForm() {
    this.empSearchForm = this.formBuilder.group({
      'name': ['', [Validators.minLength(3)]],
      'msisdn': ['', [Validators.minLength(3)]],
      'position_id': [''],
      'group_id': ['']
    });

  }

  searchEmployee() {
    if (this.empSearchForm.valid) {
      this.countEmployeeData();
      this.getEmployeeData();
    }
  }

  getFilterParams() {
    if (this.empSearchForm.valid) {
      let filterParams = {};
      if (this.empSearchForm.value.name != "" && this.empSearchForm.value.name != null) {
        filterParams["name"] = this.empSearchForm.value.name;
      }
      if (this.empSearchForm.value.msisdn != "" && this.empSearchForm.value.msisdn != null) {
        filterParams["msisdn"] = this.empSearchForm.value.msisdn;
      }

      if (this.empSearchForm.value.position_id != "" && this.empSearchForm.value.position_id != null) {
        filterParams["position_id"] = this.empSearchForm.value.position_id;
      }

      if (this.empSearchForm.value.group_id != "" && this.empSearchForm.value.group_id != null) {
        filterParams["group_id"] = this.empSearchForm.value.group_id;
      }
      return filterParams;
    }
    return null;
  }

  sortItems($event): any {
    this.sortingParams = {
      "order_by": $event.order_by,
      "order_direction": $event.order_direction
    };
    this.getEmployeeData();
  }

  setGroupPageByScroll($event): void {
    // alert($event);
    if ($event && this.isMoreGroupDataExists) {
      this.pageNumForGrp++;
    }
    if (!this.isMoreGroupDataExists) {
      this.pageNumForGrp = 1;
    }
    this.getGroupList();
  }

  setPositionPageByScroll($event): void {
    // alert($event);
    if ($event && this.isMorePositionDataExists) {
      this.pageNumForPos++;
    }
    if (!this.isMorePositionDataExists) {
      this.pageNumForPos = 1;
    }
    this.getPositionList();
  }

  setCheckBoxHover($event) {
    this.hoverCheckBox = $event;
  }
}

//
