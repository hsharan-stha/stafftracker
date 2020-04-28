import {Component, OnInit, Injectable} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormArray, FormControl} from '@angular/forms';
import {NgbTimeStruct, NgbTimeAdapter} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subject, merge} from 'rxjs';
import {concatMap, debounceTime, distinctUntilChanged, filter, map, takeUntil} from 'rxjs/operators';
import {componentDestroyed} from 'src/app/core/takeUntil-function';
import {EmployeeService} from "../../employee/service/employee.service";
import {AlertMessageService} from "../../service/alert-message.service";
import {Staticdata} from "../StaticData/staticdata.schedule";
import {GroupService} from "../../group/service/group.service";
import {ScheduleService} from "../service/schedule.service";
import {
  GroupEmployeeDeletedFormAdapter,
  GroupEmployeeFormAdapter,
  ScheduleFormAdapter
} from "../adapter/schedule.adapter";
import {Message} from "../StaticData/message.schedule";

/**
 * Example of a String Time adapter
 */
@Injectable()
export class NgbTimeStringAdapter extends NgbTimeAdapter<string> {

  fromModel(value: string): NgbTimeStruct {
    if (!value) {
      return null;
    }
    const split = value.split(':');
    return {
      hour: parseInt(split[0], 10),
      minute: parseInt(split[1], 10),
      second: parseInt(split[2], 10)
    };
  }

  toModel(time: NgbTimeStruct): string {
    if (!time) {
      return null;
    }
    return `${this.pad(time.hour)}:${this.pad(time.minute)}:${this.pad(time.second)}`;
  }

  private pad(i: number): string {
    return i < 10 ? `0${i}` : `${i}`;
  }
}

@Component({
  selector: 'schedule-create',
  templateUrl: './schedule-create.component.html',
  providers: [{provide: NgbTimeAdapter, useClass: NgbTimeStringAdapter}],
  styleUrls: ['./schedule-create.component.css']
})
export class ScheduleCreateComponent implements OnInit {
  schedule_id: number;
  scheduleForm: FormGroup;
  searchEmpForm: FormGroup;
  searchGrpForm: FormGroup;
  inputEmpFilterChanged: Subject<string> = new Subject();
  inputGrpFilterChanged: Subject<string> = new Subject();
  imageURL;
  employees = [];
  filteredEmployees = [];
  selectedEmployee = [];
  groups = [];
  filteredGroups = [];
  selectedGroups = [];
  chosenGroupsForDelete = [];
  chosenEmployeesForDelete = [];
  title: string = Staticdata.ADDNEW;
  btnName: string = Staticdata.SAVE;
  btnBack: string = Staticdata.BACK;
  cardTitle: string = Staticdata.TITLE;
  cardTitle2: string = Staticdata.TITLE2;
  addeditTitle: string = Staticdata.ADDTITLE;
  addeditTitle2: string = Staticdata.ADDTITLE2;
  isEmployeeMoreDataExists: boolean = true;
  isGroupMoreDataExists: boolean = true;
  empListloader: boolean = false;
  grpListloader: boolean = false;
  selectedEmpListloader: boolean = false;
  selectedGrpListloader: boolean = false;
  setSat: boolean = false;
  setSun: boolean = false;
  btnDisabled: boolean = false;
  insertLoader: boolean = false;
  pageNumForEmp: number = 1;
  pageNumForGrp: number = 1;
  unCheckedBox = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertMessageService,
    private employeeService: EmployeeService,
    private groupService: GroupService,
    private service: ScheduleService,
    private empgrpAdapter: GroupEmployeeFormAdapter,
    private empgrpDeletedAdapter: GroupEmployeeDeletedFormAdapter,
    private scheduleFormAdapter: ScheduleFormAdapter
  ) {
    this.route.params.pipe(takeUntil(componentDestroyed(this))).subscribe(params => this.schedule_id = parseInt(params['id']));

  }

  ngOnInit() {
    this.initForm();
    this.getEmployees();
    this.getGroups();
    this.inputEmpFilterChanged.pipe(
      debounceTime(500),
      distinctUntilChanged()).pipe(takeUntil(componentDestroyed(this))).subscribe(searchTextValue => {
      this.filterEmployeeList();
    });
    this.inputGrpFilterChanged.pipe(
      debounceTime(500),
      distinctUntilChanged()).pipe(takeUntil(componentDestroyed(this))).subscribe(searchTextValue => {
      this.filterGroupList();
    });
    this.checkEditFoem();
    this.setImageURI();
  }

  checkEditFoem(): void {
    if (this.schedule_id) {
      // alert(this.schedule_id);
      this.btnName = Staticdata.UPDATE;
      this.title = Staticdata.EDIT;
      this.addeditTitle = Staticdata.EDITTITLE;
      this.selectedEmpListloader = true;
      this.selectedGrpListloader = true;
      this.service.getByID(this.schedule_id).pipe(takeUntil(componentDestroyed(this))).subscribe(
        res => {
          console.log(res);
          this.scheduleForm.patchValue(
            {
              scheduleName: res.name,
              startWorkTime: res.start_work,
              endWorkTime: res.end_work,
              startLunchTime: res.start_lunch,
              endLunchTime: res.end_lunch,
              loyalty: res.loyalty,
              track_freq: res.track_freq,
              checkboxMO: res.days.includes("1"),
              checkboxTU: res.days.includes("2"),
              checkboxWE: res.days.includes("3"),
              checkboxTH: res.days.includes("4"),
              checkboxFR: res.days.includes("5"),
              checkboxSA: res.days.includes("6"),
              checkboxSU: res.days.includes("7"),
            }
          );
          this.getEmployeesById();
          this.getGroupsById();
          this.removeValidators(this.scheduleForm.get('checkbox'));
          // this.avatarSelected = res.icon_url;
          // this.selectedFilename = res.icon_url.split('/')[2];
          // this.selectedImage = this.imageURL + res.icon_url;
          // this.countChosenEmployees = res.nr_employees;
          // this.getGroupAssignedEmployees();
          //
          // if (this.avatarSelected) {
          //     const imageControl = this.groupForm.get('image');
          //     this.removeValidators(imageControl);
          //     const avatarControl = this.groupForm.get('avatar');
          //     this.removeValidators(avatarControl);
          // }
        }
      );
    }
  }

  initForm() {
    this.scheduleForm = this.formBuilder.group({
      'scheduleName': ['', [Validators.required]],
      'checkboxMO': [true],
      'checkboxTU': [true],
      'checkboxWE': [true],
      'checkboxTH': [true],
      'checkboxFR': [true],
      'checkboxSA': [''],
      'checkboxSU': [''],
      'checkbox': [''],
      'startWorkTime': ['08:00', Validators.required],
      'endWorkTime': ['17:00', Validators.required],
      'startLunchTime': ['12:00', Validators.required],
      'endLunchTime': ['13:00', Validators.required],
      'loyalty': ['00:05', Validators.required],
      'track_freq': ['00:15'],
      'groups': new FormArray([], [Validators.required]),
      'employees': new FormArray([], [Validators.required]),
    });


    this.searchEmpForm = this.formBuilder.group({
      'name': ['', Validators.minLength(3)]
    });

    this.searchGrpForm = this.formBuilder.group({
      'name': ['', Validators.minLength(3)]
    });
  }

  selectEmployee(id) {
    let index = this.getIndexOfItem(this.filteredEmployees, id);
    if (index !== -1) {
      if (this.afterSelectCheckAvailability(this.selectedEmployee, id) === false) {
        this.selectedEmployee.push(this.filteredEmployees[index]);
        const formArray: FormArray = this.scheduleForm.get('employees') as FormArray;
        formArray.push(new FormControl(this.filteredEmployees[index]));
      }
      console.log(this.scheduleForm.get('employees').value);
      this.filteredEmployees.splice(index, 1);
    }
  }


  deselectEmployee(id) {
    let index = this.getIndexOfItem(this.selectedEmployee, id);
    if (index !== -1) {
      if (this.afterSelectCheckAvailability(this.filteredEmployees, id) === false) {
        this.filteredEmployees.push(this.selectedEmployee[index]);
      }
      if (this.schedule_id) {
        this.chosenEmployeesForDelete.push(this.selectedEmployee[index]);
      } else {
        const formArray: FormArray = this.scheduleForm.get('employees') as FormArray;
        formArray.removeAt(index);
      }
      this.selectedEmployee.splice(index, 1);
    }
    console.log(this.scheduleForm.get('employees').value);

  }

  selectGroup(id) {
    let index = this.getIndexOfItem(this.filteredGroups, id);
    if (index !== -1) {
      if (this.afterSelectCheckAvailability(this.selectedGroups, id) === false) {
        this.selectedGroups.push(this.filteredGroups[index]);
        const formArray: FormArray = this.scheduleForm.get('groups') as FormArray;
        formArray.push(new FormControl(this.filteredGroups[index]));
      }
      this.filteredGroups.splice(index, 1);
    }
  }

  deselectGroup(id) {
    let index = this.getIndexOfItem(this.selectedGroups, id);
    if (index !== -1) {
      if (this.afterSelectCheckAvailability(this.filteredGroups, id) === false) {
        this.filteredGroups.push(this.selectedGroups[index]);
      }
      if (this.schedule_id) {
        this.chosenGroupsForDelete.push(this.selectedGroups[index]);
      } else {
        const formArray: FormArray = this.scheduleForm.get('groups') as FormArray;
        formArray.removeAt(index);
      }

      this.selectedGroups.splice(index, 1);
    }
  }


  afterSelectCheckAvailability(arr, id): boolean {
    if (this.getIndexOfItem(arr, id) !== -1) {
      return true;
    } else {
      return false;
    }
  }

  filterEmployeeList() {
    if (this.searchEmpForm.valid) {
      this.pageNumForEmp = 1;
      this.employees = [];
      this.filteredEmployees = [];
      this.isEmployeeMoreDataExists = true;
      this.getEmployees();
    }
    // let name = this.searchEmpForm.value.name;
    // this.filteredEmployees = this.employees;
    //
    // if (this.selectedEmployee.length > 0) {
    //     let toRemove = this.selectedEmployee.map(emp => emp.id);
    //     this.filteredEmployees = this.filteredEmployees.filter(emp => !toRemove.includes(emp.id));
    // }
    //
    // //filter employee list by employee name
    // this.filteredEmployees = name === '' ?
    //     this.filteredEmployees : this.filteredEmployees.filter(emp => emp.name.toLowerCase().indexOf(name.toLowerCase()) > -1);
  }


  filterGroupList() {
    if (this.searchGrpForm.valid) {
      this.pageNumForGrp = 1;
      this.groups = [];
      this.filteredGroups = [];
      this.isGroupMoreDataExists = true;
      this.getGroups();
    }
    // let name = this.searchGrpForm.value.name;
    // this.filteredGroups = this.groups;
    //
    // if (this.selectedGroups.length > 0) {
    //     let toRemove = this.selectedGroups.map(grp => grp.id);
    //     this.filteredGroups = this.filteredGroups.filter(grp => !toRemove.includes(grp.id));
    // }
    //
    // //filter group list by group name
    // this.filteredGroups = name === '' ?
    //     this.filteredGroups : this.filteredGroups.filter(grp => grp.name.toLowerCase().indexOf(name.toLowerCase()) > -1);
  }

  getIndexOfItem(arr, id) {
    return arr.findIndex(x => x.id === id);
  }

  btnBackClicked() {
    this.router.navigate(['main/schedule']);
  }

  toStore() {
    console.log(this.scheduleForm.value);
    if (this.scheduleForm.valid) {
      this.btnDisabled = true;
      this.insertLoader = true;
      let data = this.scheduleForm.value;
      let empData = [];
      let grpData = [];


      let deletedEmployeesItems = this.chosenEmployeesForDelete;
      if (deletedEmployeesItems.length > 0) {
        deletedEmployeesItems.map(res => {
          empData.push(this.empgrpDeletedAdapter.adapt(res));
        });
      }

      let deletedGroupItems = this.chosenGroupsForDelete;
      if (deletedGroupItems.length > 0) {
        deletedGroupItems.map(res => {
          grpData.push(this.empgrpDeletedAdapter.adapt(res));
        });
      }
      console.log(data.employees);

      data.employees.map(
        item => {
          // // console.log(empData);
          // let getD = empData.filter(x => Number(x.id) === Number(item.id));
          // let getDeletedID;
          // if (getD.length > 0) {
          //     console.log(getD[0].id);
          // }
          // console.log(item.id);
          empData.push(this.empgrpAdapter.adapt(item));
        }
      );
      data.groups.map(
        item => {
          grpData.push(this.empgrpAdapter.adapt(item));
        }
      );


      delete data.employees;
      delete data.groups;

      data.employees = empData;
      data.groups = grpData;
      if (this.schedule_id) {
        data.id = this.schedule_id;
      }
      let upload = this.scheduleFormAdapter.adapt(data);
      console.log(upload);
      if (this.btnName === Staticdata.UPDATE) {
        this.service.renew(upload).pipe(takeUntil(componentDestroyed(this))).subscribe(
          res => {
            if (res['code'] === 0) {
              this.success(Message.UPDATE_SUCCESS);
            }
          }, err => {
            this.error(err);
          }
        );
      } else {
        this.service.add(upload).pipe(takeUntil(componentDestroyed(this))).subscribe(
          res => {
            if (res['code'] === 0) {
              this.success(Message.CREATE_SUCCESS);
            }
          }, err => {
            this.error(err);
          }
        );
      }
    }
  }

  getEmployees(): void {
    let params = {
      "limit": 50,
      "page_number": this.pageNumForEmp,
      "order_by": "name",
      "order_direction": "ASC",
      "filters": this.searchEmpForm.value.name ? {"name": this.searchEmpForm.value.name} : {}
    };
    console.log(params);
    if (this.isEmployeeMoreDataExists) {
      this.empListloader = true;
      let listfilteredEmployees = [];
      this.employeeService.getEmployees(params).pipe(takeUntil(componentDestroyed(this))).subscribe(
        data => {
          this.employees = data;
          listfilteredEmployees = data;
        }, (err) => {
          this.error(err);
        },
        () => {
          if (listfilteredEmployees.length > 0) {
            for (let i = 0; i < listfilteredEmployees.length; i++) {
              this.filteredEmployees.push(listfilteredEmployees[i]);
            }
          }
          if (listfilteredEmployees.length < 50) {
            this.isEmployeeMoreDataExists = false;
          }
          this.empListloader = false;
        }
      )
    }

  }

  getEmployeesById(): void {
    let params = {
      "page_number": 1,
      "filters": this.schedule_id ? {"schedule_id": this.schedule_id} : {}
    };
    const controlName = this.scheduleForm.get('employees');

    this.employeeService.getEmployees(params).pipe(takeUntil(componentDestroyed(this))).subscribe(
      data => {
        this.selectedEmployee = data;
        // let that = this;
        // if (this.selectedEmployee.length > 0) {
        //     this.selectedEmployee.forEach(function check(value, index) {
        //         const formArray: FormArray = that.scheduleForm.get('employees') as FormArray;
        //         formArray.push(new FormControl(that.selectedEmployee[index]));
        //     });
        // }
        // if (this.selectedEmployee.length > 0) {
        this.removeValidators(controlName);
        // }
        this.selectedEmpListloader = false;
      }, err => {
        this.removeValidators(controlName);
        this.selectedEmpListloader = false;
      });

  }

  getGroups(): void {
    let params = {
      "limit": 50,
      "page_number": this.pageNumForGrp,
      "order_by": "name",
      "order_direction": "ASC",
      "filters": this.searchGrpForm.value.name ? {"name": this.searchGrpForm.value.name} : {}
    };
    if (this.isGroupMoreDataExists) {
      this.grpListloader = true;
      let listfilteredGroups = [];
      this.groupService.getAll(params).pipe(takeUntil(componentDestroyed(this))).subscribe(
        data => {
          this.groups = data;
          listfilteredGroups = data;
        }, (err) => {
          this.error(err);
        },
        () => {
          if (listfilteredGroups.length > 0) {
            for (let i = 0; i < listfilteredGroups.length; i++) {
              this.filteredGroups.push(listfilteredGroups[i]);
            }
          }
          if (listfilteredGroups.length < 50) {
            this.isGroupMoreDataExists = false;
          }
          this.grpListloader = false;
        }
      )
    }

  }

  getGroupsById(): void {
    let params = {
      "page_number": 1,
      "filters": this.schedule_id ? {"schedule_id": this.schedule_id} : {}
    };
    this.groupService.getAll(params).pipe(takeUntil(componentDestroyed(this))).subscribe(
      data => {
        this.selectedGroups = data;
        // let that = this;
        // if (this.selectedGroups.length > 0) {
        //     this.selectedGroups.forEach(function check(value, index) {
        //         const formArray: FormArray = that.scheduleForm.get('groups') as FormArray;
        //         formArray.push(new FormControl(that.selectedGroups[index]));
        //     });
        // }
        // if (this.selectedGroups.length > 0) {
        const controlName = this.scheduleForm.get('groups');
        this.removeValidators(controlName);
        // }
        this.selectedGrpListloader = false;
      });
  }

  removeValidators(controlName): void {
    controlName.clearValidators();
    controlName.updateValueAndValidity();
  }

  setValidators(controlName): void {
    controlName.setValidators([Validators.required]);
    controlName.updateValueAndValidity();
  }

  success(msg): void {
    this.alertService.show({
      message: msg,
      alertType: "success"
    });
    this.btnDisabled = false;
    this.insertLoader = false;
    this.redirectMainPage();
  }

  error(err): void {
    this.alertService.show({
      message: err.error.result,
      alertType: "error"
    });
    this.btnDisabled = false;
    this.insertLoader = false;
  }

  redirectMainPage(): void {
    this.router.navigate([Staticdata.MAINPAGE]);
  }

  setImageURI(): void {
    this.imageURL = this.service.getBaseIPURL();
  }

  setPageByScrollForEmp($event): void {
    if ($event && this.isEmployeeMoreDataExists) {
      this.pageNumForEmp++;
    }
    if (!this.isEmployeeMoreDataExists) {
      this.pageNumForEmp = 1;
    }
    this.getEmployees();
  }

  setPageByScrollForGrp($event): void {
    if ($event && this.isGroupMoreDataExists) {
      this.pageNumForGrp++;
    }
    if (!this.isGroupMoreDataExists) {
      this.pageNumForGrp = 1;
    }
    this.getGroups();
  }

  checkBox($event, id): void {
    let controlName = this.scheduleForm.get('checkbox');
    if ($event.target.checked) {
      this.unCheckedBox = this.unCheckedBox.filter(x => x.id !== id);
      this.removeValidators(controlName);
    } else {
      if (!this.schedule_id) {
        this.unCheckedBox.push({'id': id});
      }
    }
    if (id === 6) {
      this.setSat = true;
    } else if (id === 7) {
      this.setSun = true;
    }
    console.log(this.unCheckedBox);
    if (this.setSat && this.setSun) {
      if (this.unCheckedBox.length === 7) {
        this.setValidators(controlName);
      }
    } else if (this.setSat || this.setSun) {
      if (this.unCheckedBox.length === 6) {
        this.setValidators(controlName);
      }
    } else {
      if (this.unCheckedBox.length === 5) {
        this.setValidators(controlName);
      }
    }


  }

  ngOnDestroy() {
  }
}
