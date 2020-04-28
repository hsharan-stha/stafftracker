import {Component, OnInit, HostListener, ViewChild, ElementRef} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {GetWindowHeightService} from 'src/app/service/get-window-height.service';
import {takeUntil} from 'rxjs/operators';
import {componentDestroyed} from 'src/app/core/takeUntil-function';
import {GroupService} from "../service/group.service";
import {Group} from "../model/group.model";
import {Staticdata} from "../StaticData/staticdata.group";
import {ScheduleService} from "../../schedule/service/schedule.service";

@Component({
  selector: 'group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {
  searchForm: FormGroup;
  p: number = 1;
  pageNumForSchedule: number = 1;
  collection = [];
  showExpandBtn = true;
  perPageItem = 20;
  totalRows;
  sortingParams;
  loader: boolean = false;
  isMoreScheduleDataExists: boolean = true;
  fieldName: string = "name";
  countRow: number;
  createPage = Staticdata.CREATEPAGE;
  @ViewChild('groupTable') elementView: ElementRef;
  groups: Group[];
  filteredGroups: Group[];
  schedules = [];
  innerWidth;
  laptopSize: boolean = false;
  imageURL;
  hoverCheckBox: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private getWindowHeightService: GetWindowHeightService,
    private service: GroupService,
    private scheduleService: ScheduleService
  ) {
  }

  ngOnInit() {
    this.initSortingParams();
    this.initForm();
    this.adjustWidth();
    this.onDelete();
    this.forExpandAndPagination();
    setTimeout(() => {
      this.initTable();
    }, 20);
    this.setImageURI();
    this.getSchedules();
  }

  setImageURI(): void {
    this.imageURL = this.service.getBaseIPURL();
  }

  initSortingParams(): void {
    this.sortingParams = {
      "order_by": this.fieldName,
      "order_direction": "ASC"
    };
  }

  onDelete(): void {
    this.service.getNotify().pipe(takeUntil(componentDestroyed(this))).subscribe(
      (data) => {
        if (data === true) {
          this.getGroupData();
          this.forExpandAndPagination();
        }
      }
    )
  }

  initTable() {
    let tableHeaderHeight = 29;
    let tableRowsHeight = 73;
    this.getWindowHeightService.getData(this.elementView, tableHeaderHeight, tableRowsHeight, "groupTbl");
    this.getWindowHeightService.windowSizeChanged.pipe(takeUntil(componentDestroyed(this))).subscribe(
      value => {
        this.perPageItem = value.rows;
        this.getGroupData();
      }
    );
  }

  getGroupData(): void {
    let params = {
      "limit": this.perPageItem,
      "page_number": this.p,
      "order_by": this.sortingParams.order_by,
      "order_direction": this.sortingParams.order_direction,
      "filters": this.searchForm.value.group_name || this.searchForm.value.schedule ?
        (this.searchForm.value.group_name ?
          {"name": this.searchForm.value.group_name} : {"schedule_id": this.searchForm.value.schedule}) : {}
    };
    console.log(params);
    // "filters": this.searchForm.valid && this.searchForm.value.group_name ? {"name": this.searchForm.value.group_name} : {}

    this.loader = true;
    this.getGroups(params);
  }

  forExpandAndPagination() {
    let params = {
      "limit": 1,
      "page_number": 0,
      "filters": this.searchForm.value.group_name || this.searchForm.value.schedule ?
        (this.searchForm.value.group_name ?
          {"name": this.searchForm.value.group_name} : {"schedule_id": this.searchForm.value.schedule}) : {}
    };
    // "filters": this.searchForm.valid && this.searchForm.value.group_name ? {"name": this.searchForm.value.group_name} : {}

    this.getGroups(params);
  }

  getGroups(params) {
    this.service.getAll(params).pipe(takeUntil(componentDestroyed(this))).subscribe(
      data => {
        if (typeof data === "number") {
          this.countRow = data;
          return false;
        }
        this.groups = data;
        this.filteredGroups = this.groups;
        this.loader = false;
      }
    );
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
      'group_name': ['', Validators.minLength(3)],
      'schedule': ['']
    })
  }

  addGroupView() {
    this.router.navigate([this.createPage]);
  }

  findGroup() {
    if (this.searchForm.valid) {
      this.forExpandAndPagination();
      this.getGroupData();
      //     let filterKey = this.searchForm.value.group_name.toLowerCase();
      //     // let filterSchedule = this.searchForm.value.schedule;
      //     this.filteredGroups = this.groups.filter(function (group) {
      //         // return group.name.toLowerCase().indexOf(filterKey) > -1 && (group.schedule == filterSchedule);
      //         return group.name.toLowerCase().indexOf(filterKey) > -1;
      //     });
      // } else {
      //     this.filteredGroups = this.groups;
    }
  }

  editGroupInformation(id) {
    this.router.navigate([Staticdata.MAINPAGE + id]);
  }

  deleteGroup(id) {
    this.router.navigate([Staticdata.MAINPAGE + "/delete/" + id]);
  }

  // selectedData($data) {
  //     alert((typeof $data) === "undefined");
  //     // this.searchForm.get("schedule").setValue($data);
  // }

  pageNumber($event): void {
    this.p = $event;
    this.searchForm.get("group_name").setValue('');
    this.getGroupData();

  }

  expandTable() {
    this.showExpandBtn = false;
    // this.initTable();
  }


  sortItems($event): any {
    this.sortingParams = {
      "order_by": $event.order_by,
      "order_direction": $event.order_direction
    };
    this.getGroupData();
  }

  filterValue($value) {
    if ($value === "" || (typeof $value) === "undefined") {
      this.searchForm.get("schedule").setValue('');
      this.forExpandAndPagination();
      this.getGroupData();
    }
  }

  // getSchedules() {
  //   let params = {
  //     "page_number": 1
  //   };
  //   this.scheduleService.getAll(params).pipe(takeUntil(componentDestroyed(this))).subscribe(
  //     data => {
  //       this.schedules = data;
  //     }
  //   );
  // }

  getSchedules(): void {
    let params = {
      "limit": 12,
      "page_number": this.pageNumForSchedule,
      "order_by": "name",
      "order_direction": "ASC"
    };
    console.log(params);
    if (this.isMoreScheduleDataExists) {
      let listfilteredSchedule = [];
      this.scheduleService.getAll(params).pipe(takeUntil(componentDestroyed(this))).subscribe(
        data => {
          listfilteredSchedule = data;
        }, (err) => {
          console.log(err);
          // this.error(err);
        },
        () => {
          if (listfilteredSchedule.length > 0) {
            for (let i = 0; i < listfilteredSchedule.length; i++) {
              this.schedules.push(listfilteredSchedule[i]);
            }
          }
          if (listfilteredSchedule.length < 12) {
            this.isMoreScheduleDataExists = false;
          }
        }
      );
    }

  }

  setSchedulePageByScroll($event): void {
    if ($event && this.isMoreScheduleDataExists) {
      this.pageNumForSchedule++;
    }
    if (!this.isMoreScheduleDataExists) {
      this.pageNumForSchedule = 1;
    }
    this.getSchedules();
  }

  ngOnDestroy(): void {
  }
  
    setCheckBoxHover($event) {
        this.hoverCheckBox = $event;
    }

}
