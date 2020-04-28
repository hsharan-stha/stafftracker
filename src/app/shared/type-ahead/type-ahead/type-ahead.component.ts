import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  Renderer2, OnChanges, SimpleChanges
} from '@angular/core';
import {DataService} from './../../../service/data.service';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {Observable, Subject, merge} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map, takeUntil} from 'rxjs/operators';
import {componentDestroyed} from 'src/app/core/takeUntil-function';
import {EmployeeService} from "../../../employee/service/employee.service";
import {GroupService} from "../../../group/service/group.service";
import {FormControl} from "@angular/forms";
import {GeozoneService} from "../../../geozone/service/geozone.service";
import {AlertMessageService} from "../../../service/alert-message.service";


@Component({
  selector: 'type-ahead',
  templateUrl: './type-ahead2.component.html',
  styleUrls: ['./type-ahead.component.css']
})
export class TypeAheadComponent implements OnInit, OnChanges {
  @Input() formName: string;
  @Input() form_control_name: string;
  @Input() dataGroupName: string;
  @Output() inputChanged: EventEmitter<string> = new EventEmitter();
  @Input() allowedMaxItem: number;
  @Input() placeholder: string;
  @Input() secondaryPlaceholder: string = "Search";
  @Input() image_path;
  @Input() isValid;
  @Input() onlyFromAutocomplete = true;
  filterValue: string = '';
  limitCount: number = 50;
  pageNum: number = 1;
  @Input() totalStatesWithFlags: number;
  invalidMessageBox: boolean = false;
  firstTrigger: boolean = false;
  searchIcon: boolean = true;
  loader: boolean = true;
  // public items1 = [{display: 'Item1', value: 0}, 'item2', 'item3'];
  //
  // formatter = (x: { name: string }) => x.name;
  @Input() statesWithFlags: any;
  @ViewChild('input') inputBox: ElementRef;
  @Output() onRemoveEmit: EventEmitter<string> = new EventEmitter();

  constructor(
    private data: DataService,
    private renderer: Renderer2,
    private employeeService: EmployeeService,
    private groupService: GroupService,
    private geozoneService: GeozoneService,
    private alertService: AlertMessageService
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (typeof changes['isValid'] !== 'undefined') {
      if (typeof changes['isValid'].previousValue === 'undefined') {
        this.searchIcon = true;
      } else {
        this.searchIcon = (this.isValid !== "falseno" && this.isValid !== "falseyes" && this.isValid !== "false");
      }
    }

    if (typeof changes['statesWithFlags'] !== 'undefined') {
      console.log(changes['statesWithFlags']);
    }
  }

  ngOnInit() {
    this.addActionEvent();
    this.loader = true;
    // let countRows = {"page_number": 0, "limit": 1};
    this.firstTrigger = true;
    if (this.dataGroupName === 'Employee' || this.dataGroupName === 'ChooseEmployee') {
      this.getLimitedEmployees();
      // this.employeeService.getEmployees(countRows).pipe(takeUntil(componentDestroyed(this))).subscribe(data => {
      //   let count = data;
      //   if (typeof count === 'number') {
      //     let params = {"page_number": 1, "limit": count};
      //     this.employeeService.getEmployees(params).pipe(takeUntil(componentDestroyed(this))).subscribe(data => {
      //       this.statesWithFlags = data;
      //       console.log(this.statesWithFlags)
      //     });
      //   }
      // }, error => console.log(error));
    } else if (this.dataGroupName === 'Group') {
      this.getLimitedGroups();
      // this.groupService.getAll(countRows).pipe(takeUntil(componentDestroyed(this))).subscribe(data => {
      //   let count = data;
      //   if (typeof count === 'number') {
      //     let params = {"page_number": 1, "limit": count};
      //     this.groupService.getAll(params).pipe(takeUntil(componentDestroyed(this))).subscribe(data => {
      //       this.statesWithFlags = data;
      //     });
      //   }
      // }, error => console.log(error));

    } else if (this.dataGroupName == 'Geozone') {
      this.getLimitedGeozone();
      // this.geozoneService.getAll(countRows).pipe(takeUntil(componentDestroyed(this))).subscribe(data => {
      //   let count = data;
      //   if (typeof count === 'number') {
      //     let params = {"page_number": 1, "limit": count};
      //     this.geozoneService.getAll(params).pipe(takeUntil(componentDestroyed(this))).subscribe(data => {
      //       console.log(data);
      //       this.statesWithFlags = data;
      //     });
      //   }
      // }, error => console.log(error));

      // this.data.getTAGeozoneJSON().pipe(takeUntil(componentDestroyed(this))).subscribe(data => {
      //   this.statesWithFlags = data;
      // }, error => console.log(error));
    } else if (this.dataGroupName == 'Position') {
      this.data.getTAGeozoneJSON().pipe(takeUntil(componentDestroyed(this))).subscribe(data => {
        this.statesWithFlags = data;
      }, error => console.log(error));
    }
  }

  ngOnDestroy() {
  }

  // @ViewChild('instance') instance: NgbTypeahead;
  // searchInput;
  // @ViewChild("searchInput") searchInputRef: ElementRef;
  // focus$ = new Subject<string>();
  // click$ = new Subject<string>();
  //
  // search = (text$: Observable<string>) => {
  //     const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
  //     const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
  //     const inputFocus$ = this.focus$;
  //
  //     return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
  //         map(term => (term === '' ? this.statesWithFlags
  //             : this.statesWithFlags.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
  //     );
  // }
  //
  // searchIconClicked() {
  //     this.searchInput.nativeElement.focus();
  // }

  inputValueChanged(data) {
    console.log(data);
    this.invalidMessageBox = false;
    this.filterValue = '';
    this.inputChanged.emit(data);
  }

  errorHandler($event) {
    $event.target.src = "assets/icons/blue_user.svg";
  }

  displayMessage(): void {
    this.invalidMessageBox = !this.invalidMessageBox;
  }

  getLimitedEmployees(): void {
    let params = {
      "page_number": this.pageNum,
      "limit": this.limitCount,
      "order_direction": "ASC",
      "order_by": "name",
      "filters": {"name": this.filterValue}
    };
    this.employeeService.getEmployees(params).pipe(takeUntil(componentDestroyed(this))).subscribe(data => {
      this.afterSuccess(data);
    }, err => {
      this.error(err);
    });
  }

  getLimitedGroups(): void {
    let params = {
      "page_number": this.pageNum,
      "limit": this.limitCount,
      "order_direction": "ASC",
      "order_by": "name",
      "filters": {"name": this.filterValue}
    };
    this.groupService.getAll(params).pipe(takeUntil(componentDestroyed(this))).subscribe(data => {
      this.afterSuccess(data);
    }, err => {
      this.error(err);
    });
  }

  getLimitedGeozone(): void {
    let params = {
      "page_number": this.pageNum,
      "limit": this.limitCount,
      "order_direction": "ASC",
      "order_by": "name",
      "filters": {"name": this.filterValue}
    };
    this.geozoneService.getAll(params).pipe(takeUntil(componentDestroyed(this))).subscribe(data => {
      this.afterSuccess(data);
    }, err => {
      this.error(err);
    });
  }

  setFilterText($event) {
    // let firstElem = this.inputBox.nativeElement.firstChild.firstChild.firstChild;
    // if (firstElem.firstElementChild.nextSibling === null) {
    //   this.filterValue = (firstElem.firstElementChild.firstChild.firstChild.value);
    // } else {
    //   this.filterValue = firstElem.children[firstElem.children.length - 1].firstChild.firstChild.value;
    // }
    this.filterValue = this.inputComponent().value;
    console.log(this.filterValue);
    // if ($event.keyCode >= 65 && $event.keyCode <= 90) {
    //   this.filterValue += $event.key;
    // } else if ($event.keyCode === 8) {
    //   this.filterValue = this.filterValue.substring(0, this.filterValue.length - 1);
    // }
    this.firstTrigger = false;
    if (this.filterValue.length === 3) {
      if (this.dataGroupName === 'Employee' || this.dataGroupName === 'ChooseEmployee') {
        this.getLimitedEmployees();
      } else if (this.dataGroupName === 'Group') {
        this.getLimitedGroups();
      } else if (this.dataGroupName === 'Geozone') {
        this.getLimitedGeozone();
      }
    }
  }

  emptyFilterValue(): void {
    this.filterValue = '';
    this.firstTrigger = false;
    if ((typeof this.statesWithFlags !== "undefined") && (this.statesWithFlags.length < this.totalStatesWithFlags)) {
      if (this.dataGroupName === 'Employee' || this.dataGroupName === 'ChooseEmployee') {
        this.getLimitedEmployees();
      } else if (this.dataGroupName === 'Group') {
        this.getLimitedGroups();
      } else if (this.dataGroupName === 'Geozone') {
        this.getLimitedGeozone()
      }
    }
  }

  clickSearchIcon() {
    this.inputComponent().click();
    // let firstElem = this.inputBox.nativeElement.firstChild.firstChild.firstChild;
    // if (firstElem.firstElementChild.nextSibling === null) {
    //   firstElem.firstElementChild.firstChild.firstChild.click();
    // } else {
    //   firstElem.children[firstElem.children.length - 1].firstChild.firstChild.click();
    // }
  }

  tracked(currentComponent) {
    return (control: FormControl) => {
      if (control.value !== "") {
        let value = currentComponent.statesWithFlags.find(x => x.id === control.value);
        if (typeof value !== "undefined" && value.rejected_tracking === "1" && (this.dataGroupName === "Employee")) {
          return {
            'boolean@': true
          };
        } else {
          return null;
        }
      }
    };

  }

  public validators = [this.tracked(this)];


  error(err): void {
    this.alertService.show({
      message: err.error.result,
      alertType: "error"
    });
  }

  onRemove(e) {
    this.onRemoveEmit.emit(e);
  }

  addActionEvent() {
    let firstElem = this.inputBox.nativeElement.firstChild.firstChild;
    firstElem.addEventListener('click', () => {
      this.clickSearchIcon();
    })
  }

  afterSuccess(data) {
    this.statesWithFlags = data;
    this.loader = false;
    if (this.firstTrigger === true) {
      this.totalStatesWithFlags = data.length;
      console.log(this.totalStatesWithFlags);
    }
  }

  inputComponent(): any {
    let inputElement;
    let firstElem = this.inputBox.nativeElement.firstChild.firstChild.firstChild;
    if (firstElem.firstElementChild.nextSibling === null) {
      inputElement = (firstElem.firstElementChild.firstChild.firstChild);
    } else {
      inputElement = firstElem.children[firstElem.children.length - 1].firstChild.firstChild;
    }
    return inputElement;
  }

}
