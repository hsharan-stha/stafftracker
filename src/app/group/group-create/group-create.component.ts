import {Component, ElementRef, HostListener, OnInit, ViewChild, Renderer2} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {DomSanitizer} from "@angular/platform-browser";
import {componentDestroyed} from 'src/app/core/takeUntil-function';
import {GroupService} from "../service/group.service";
import {EmployeeService} from "../../employee/service/employee.service";
import {Staticdata} from "../StaticData/staticdata.group";
import {AlertMessageService} from "../../service/alert-message.service";
import {Message} from "../StaticData/message.group";
import {ImageSnippet} from "../../models/ImageSnippet.model";
import {GroupEmpDeletedFormAdapter, GroupEmpFormAdapter, GroupFormAdapter} from "../adapter/group.adapter";
import {stringify} from "querystring";
import {CaptchaService} from "../../service/captcha.service";

@Component({
  selector: 'group-create',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.css']
})
export class GroupCreateComponent implements OnInit {
  // elementView;
  // @ViewChild('top_card') elementViewRef: ElementRef;
  group_id = null;
  pageTitle1 = Staticdata.ADDNEW;
  pageTitle2 = Staticdata.NEW;
  pageTitle3 = Staticdata.ADDTITLE;
  mainPage = Staticdata.MAINPAGE;
  imagePath: string = "StaffTracker/images/";
  avatars = [
    {id: 1, name: this.imagePath + 'operators.png'},
    {id: 2, name: this.imagePath + 'accountant.png'},
    {id: 3, name: this.imagePath + 'admins.png'}
  ];
  employees;
  filteredEmployees = [];
  chosenEmployees = [];
  chosenEmployeesForDelete = [];
  countChosenEmployees = 0;
  empListloader: boolean = false;
  loaderChosenEmp: boolean = false;
  // insertLoader: boolean = false;
  avatarSelected: any;
  // topCardHeight: number;
  inputFilterChanged: Subject<string> = new Subject();
  pageNum: number = 1;
  isMoreDataExists: boolean = true;
  groupForm: FormGroup;
  searchForm: FormGroup;
  btnName = Staticdata.SAVE;
  btnBack = Staticdata.BACK;
  employeeType = "free_employee";
  selectedFile: ImageSnippet;
  selectedImage: any;
  imageURL: any;
  selectedFilename: string;
  btnDisabled: boolean = false;
  insertLoader: boolean = false;
  hoverCheckBox: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private service: GroupService,
    private employeeService: EmployeeService,
    private alertService: AlertMessageService,
    private renderer: Renderer2,
    private empAdapter: GroupEmpFormAdapter,
    private empDeletedAdapter: GroupEmpDeletedFormAdapter,
    private groupFormAdapter: GroupFormAdapter,
    private captchaService: CaptchaService
  ) {
    this.route.params.pipe(takeUntil(componentDestroyed(this))).subscribe(params => this.group_id = parseInt(params['id']));
  }

  ngOnInit() {
    // this.elementView = this.renderer.selectRootElement(this.elementViewRef);
    this.createForm();
    this.getEmployees();
    this.inputFilterChanged.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(componentDestroyed(this))
    ).subscribe(searchTextValue => {
      this.filterEmployeeList();
    });
    this.checkEdit();
    // this.topCardHeight = this.elementView.nativeElement.offsetHeight + 32;
    this.setImageURI();
  }

  setImageURI(): void {
    this.imageURL = this.service.getBaseIPURL();
  }

  checkEdit(): void {
    if (this.group_id) {
      this.empListloader = true;
      this.loaderChosenEmp = true;
      this.btnName = Staticdata.UPDATE;
      this.pageTitle1 = Staticdata.EDIT;
      this.pageTitle2 = Staticdata.EDIT;
      this.pageTitle3 = Staticdata.EDITTITLE;
      this.service.getByID(this.group_id).pipe(takeUntil(componentDestroyed(this))).subscribe(
        res => {
          console.log(res);
          this.groupForm.patchValue(
            {
              name: res.name,
              avatar: res.icon_url
            }
          )
          this.avatarSelected = res.icon_url;
          this.selectedFilename = res.icon_url.split('/')[2];
          this.selectedImage = this.imageURL + res.icon_url;
          this.countChosenEmployees = res.nr_employees;
          this.getGroupAssignedEmployees();

          if (this.avatarSelected) {
            const imageControl = this.groupForm.get('image');
            this.removeValidators(imageControl);
            const avatarControl = this.groupForm.get('avatar');
            this.removeValidators(avatarControl);
          }
        }
      );
    }
  }

  getGroupAssignedEmployees(): void {
    let params = {
      "id": this.group_id,
      "page_number": 1,
      "type": "group_employee"
    };
    this.employeeService.getEmployees(params).pipe(takeUntil(componentDestroyed(this))).subscribe(
      data => {
        this.chosenEmployees = data;
        const employeesControl = this.groupForm.get('employees');
        this.removeValidators(employeesControl);
        this.loaderChosenEmp = false;
      }
    )
  }

  getEmployees(): void {
    let params = {
      "limit": 50,
      "page_number": this.pageNum,
      "order_by": "name",
      "order_direction": "ASC",
      "type": this.employeeType,
      "filters": this.searchForm.value.employee_name || this.searchForm.value.employee_phone ?
        (this.searchForm.value.employee_name ?
          {"name": this.searchForm.value.employee_name} : {"msisdn": this.searchForm.value.employee_phone}) : {}
    };
    console.log(params);
    if (this.isMoreDataExists) {
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
            this.isMoreDataExists = false;
          }
          this.empListloader = false;
        }
      )
    }

  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // this.topCardHeight = this.elementView.nativeElement.offsetHeight + 32;
  }

  createForm(): void {
    this.groupForm = this.fb.group({
      name: ["", [Validators.required]],
      image: ["", [Validators.required]],
      avatar: ["", [Validators.required]],
      employees: new FormArray([], [Validators.required]),
    });

    this.searchForm = this.fb.group({
      'employee_name': ['', Validators.minLength(3)],
      'employee_phone': ['', Validators.minLength(3)],
      'isChecked': [''],
    });
  }

  selectAvatar(avatar) {
    this.captchaService.getCaptch().pipe(takeUntil(componentDestroyed(this))).subscribe(res => {
      if (res.code === 0) {
        this.captchaService.setCaptchaCode(res.result);
        this.avatarSelected = avatar;
        this.selectedFilename = null;
        this.selectedImage = null;
        this.groupForm.get('avatar').setValue(avatar);
        const imageControl = this.groupForm.get('image');
        this.removeValidators(imageControl);
        this.groupForm.get('image').setValue("");
      }
    });
  }

  imageFileChange($event: any) {
    this.captchaService.getCaptch().pipe(takeUntil(componentDestroyed(this))).subscribe(res => {
      if (res.code === 0) {
        this.captchaService.setCaptchaCode(res.result);
        const file: File = $event.target.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', (event: any) => {
          this.selectedFile = new ImageSnippet(event.target.result, file);
          this.selectedImage = event.target.result;
          this.selectedFilename = file.name;
          this.groupForm.patchValue({
            "image": this.selectedFile
          });
        });
        reader.readAsDataURL(file);

        const imageControl = this.groupForm.get('image');
        const avatarControl = this.groupForm.get('avatar');
        if (this.selectedFile !== null) {
          this.avatarSelected = null;
          this.groupForm.get('avatar').setValue(null);
          this.removeValidators(avatarControl);
        } else {
          imageControl.setValidators([Validators.required]);
          imageControl.updateValueAndValidity();
        }
      }
    });
  }

  storeGroup() {
    if (this.groupForm.valid) {
      let data = this.groupForm.value;
      let empData = [];
      let deletedItems = this.chosenEmployeesForDelete;
      if (deletedItems.length > 0) {
        deletedItems.map(res => {
          empData.push(this.empDeletedAdapter.adapt(res));
        });
      }
      data.employees.map(res => {
        empData.push(this.empAdapter.adapt(res));
      });

      let strEmpData = JSON.stringify(empData);
      let id = this.group_id;
      let upload = this.groupFormAdapter.adapt({data, strEmpData, id});
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

  btnBackClicked() {
    this.redirectMainPage();
  }

  redirectMainPage(): void {
    this.router.navigate([this.mainPage]);
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

  selectEmployee(id) {
    let index = this.getIndexOfItem(this.filteredEmployees, id);
    if (index !== -1) {
      if (this.afterSelectCheckAvailability(id) === false) {
        this.chosenEmployees.push(this.filteredEmployees[index]);
        const formArray: FormArray = this.groupForm.get('employees') as FormArray;
        formArray.push(new FormControl(this.filteredEmployees[index]));
        this.countSelectedEmployees()
      }

      this.filteredEmployees.splice(index, 1);
    }
  }

  afterSelectCheckAvailability(id): boolean {
    if (this.getIndexOfItem(this.chosenEmployees, id) !== -1) {
      return true;
    } else {
      return false;
    }
  }


  unSelectEmployee(id) {
    // get index of array of selected item
    let index = this.getIndexOfItem(this.chosenEmployees, id);
    if (index !== -1) {
      if (this.afterUnSelectCheckAvailability(id) === false) {
        this.filteredEmployees.push(this.chosenEmployees[index]);
      }
      if (this.group_id) {
        this.chosenEmployeesForDelete.push(this.chosenEmployees[index]);
      } else {
        const formArray: FormArray = this.groupForm.get('employees') as FormArray;
        formArray.removeAt(index);
      }
      this.chosenEmployees.splice(index, 1);
      this.countSelectedEmployees();

    }
  }

  afterUnSelectCheckAvailability(id): boolean {
    if (this.getIndexOfItem(this.filteredEmployees, id) !== -1) {
      return true;
    } else {
      return false;
    }
  }

  getIndexOfItem(arr, id) {
    return arr.findIndex(x => x.id === id);
  }

  filterEmployeeList() {
    // alert(this.searchForm.value.employee_name)
    if (this.searchForm.valid) {
      this.pageNum = 1;
      this.employees = [];
      this.filteredEmployees = [];
      this.isMoreDataExists = true;
      this.getEmployees();
    }

    // let emp_name = this.searchForm.value.employee_name;
    // let emp_phone = this.searchForm.value.employee_phone;
    // this.filteredEmployees = this.employees;
    //
    // if (this.chosenEmployees.length > 0) {
    //     let toRemove = this.chosenEmployees.map(emp => emp.id);
    //     this.filteredEmployees = this.filteredEmployees.filter(emp => !toRemove.includes(emp.id));
    // }
    //
    // //filter employee list by emp_name
    // this.filteredEmployees = emp_name === '' ? this.filteredEmployees : this.filteredEmployees.filter(emp => emp.name.toLowerCase().indexOf(emp_name.toLowerCase()) > -1);
    // //filter employee list by emp_phone
    // this.filteredEmployees = emp_phone === '' ? this.filteredEmployees : this.filteredEmployees.filter(emp => emp.msisdn.toLowerCase().indexOf(emp_phone.toLowerCase()) > -1);
  }

  // selectAllEmployees(data) {
  //     if (data) {
  //         // add all the filtered items to the chosen item
  //         const formArray: FormArray = this.groupForm.get('employees') as FormArray;
  //         this.filteredEmployees.map(emp => {
  //             this.chosenEmployees.push(emp);
  //             formArray.push(new FormControl(emp));
  //         })
  //         this.filteredEmployees = [];
  //         this.countSelectedEmployees();
  //     }
  // }

  selectFreeEmployees(data) {
    this.searchForm.patchValue({
      employee_name: "",
      employee_phone: ""
    })
    this.filteredEmployees = [];
    this.pageNum = 1;
    this.isMoreDataExists = true;
    this.employeeType = data ? null : "free_employee";
    this.getEmployees();
  }

  countSelectedEmployees(): void {
    this.countChosenEmployees = this.chosenEmployees.length;
  }

  setPageByScroll($event): void {
    if ($event && this.isMoreDataExists) {
      this.pageNum++;
    }
    if (!this.isMoreDataExists) {
      this.pageNum = 1;
    }
    this.getEmployees();
  }

  removeValidators(controlName): void {
    controlName.clearValidators();
    controlName.updateValueAndValidity();
  }

  getCaptcha(): any {
    let captchacode = '';
    this.captchaService.getCaptchaCode().pipe(takeUntil(componentDestroyed(this))).subscribe(res => {
        captchacode = res;
        this.btnDisabled = true;
        this.insertLoader = true;
      }
    );
    return captchacode;
  }

  verifyCaptcha() {
    if (this.groupForm.valid) {
      this.captchaService.checkCaptcha({'captcha_code': this.getCaptcha()}).pipe(takeUntil(componentDestroyed(this))).subscribe(res => {
          if (res.code === 0) {
            this.storeGroup();
          }
        }, err => {
          if (this.btnName === Staticdata.UPDATE) {
            this.storeGroup();
          } else {
            this.error(err);
          }
        }
      );

    }
  }

  setCheckBoxHover($event) {
    this.hoverCheckBox = $event;
  }

  ngOnDestroy() {
  }
}
