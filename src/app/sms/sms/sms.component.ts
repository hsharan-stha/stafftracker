import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  Renderer2
} from '@angular/core';
import {InputMessageBoxComponent} from '@shared/message/input-message-box/input-message-box.component';
import {ChatService} from '../../service/chat.service';
import {EmployeeService} from "../../employee/service/employee.service";
import {takeUntil} from "rxjs/operators";
import {componentDestroyed} from "../../core/takeUntil-function";
import {AppConfigService} from "../../service/AppConfig.service";
import {SmsService} from "../service/sms.service";

@Component({
  selector: 'sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.css']
})
export class SmsComponent implements OnInit {
  groupMessage = false;
  displayEmpInfo: boolean = true;
  emplistSlider: boolean = false;
  chatAreaLoader: boolean = false;
  empLoader: boolean = false;
  isMoreEmployeeDataExists: boolean = true;
  emplist: boolean = true;
  groupMessageUserList: number[] = [];
  employeeInfo = [];
  userlist = [];
  @ViewChild("mainDiv") mainDivRef: ElementRef;
  mainDiv;
  pageNumberForEmp: number = 1;
  imageUrl: string;
  messageForChat = [];
  selectedMsisdn = [];
  Employee = [];
  searchField: string;

  constructor(
    private chatService: ChatService,
    private service: SmsService,
    private renderer: Renderer2,
    private employeeService: EmployeeService,
    private appConfigService: AppConfigService,
  ) {
  }

  ngOnInit() {
    this.mainDiv = this.renderer.selectRootElement(this.mainDivRef);
    this.adjust(window.innerWidth);
    this.setUserList();
    this.getImageURL();
  }


  getImageURL(): void {
    this.imageUrl = this.appConfigService.config['base_ip'];
  }

  errorImgHandler(event) {
    event.target.src = "assets/icons/blue_user.svg";
    event.target.classList.add("img-error");
  }


  @HostListener('window:resize', ['$event'])
  sizeChange(event) {
    this.adjust(event.currentTarget.innerWidth);
  }

  adjust(width): void {
    if (width > 1300) {
      this.displayEmpInfo = true;
      this.emplistSlider = false;
      this.emplist = true;
    } else if (width < 768) {
      this.emplistSlider = true;
      this.emplist = false;
      this.displayEmpInfo = false;
    } else {
      this.emplistSlider = false;
      this.emplist = true;
      this.displayEmpInfo = false;
    }
  }

  groupMessageList(id) {
    if (this.groupMessageUserList.indexOf(id) === -1) {
      this.groupMessageUserList.push(id);
      console.log(this.groupMessageUserList);
    }
  }

  callGroupMessage() {
    this.groupMessage = true;
    // this.setUserList();
    // this.chatService.getUserMessageList()
    //     .pipe(takeUntil(componentDestroyed(this))).subscribe(
    //         (data) => {
    //             this.messageList = data;
    //         });
  }

  viewEmployeeInfo() {
    this.displayEmpInfo = !this.displayEmpInfo;
    console.log(this.displayEmpInfo);

  }

  closeGroupMessage() {
    this.groupMessage = false;

  }

  clickEmployeeInfo(event, data) {
    this.chatAreaLoader = true;
    this.messageForChat = [];
    let elements = this.mainDiv.nativeElement.querySelectorAll('.active-employee-info');
    if (elements.length > 0) {
      elements[0].classList.remove('active-employee-info');
    }
    event.target.classList.add('active-employee-info');
    this.selectedMsisdn = data.msisdn;
    this.Employee = Object.assign(data, {imageUrl: this.imageUrl});
    console.log(this.Employee);
    this.getChatMessage();
  }

  getChatMessage(): void {
    let params = {
      "msisdn": this.selectedMsisdn,
      "page_number": 1,
      "limit": 50,
      "order_by": "date",
      "order_direction": "DESC"
    };
    this.service.getAll(params).pipe(takeUntil(componentDestroyed(this))).subscribe(data => {
      if (data.length > 0) {
        let para = {additional: false};
        let firstDir = data[0].direction;
        data.filter((res, index) => {
          if (firstDir !== res.direction) {
            para.additional = true;
            firstDir = res.direction;
            if (index) {
              Object.assign(data[index - 1], para);
            }
          } else {
            para.additional = false;
          }
        });

        para.additional = true;
        Object.assign(data[data.length - 1], para);
      }
      this.chatAreaLoader = false;
      this.messageForChat = data;
    });
  }

  setUserList(): void {
    let params = {
      "limit": 50,
      "page_number": this.pageNumberForEmp,
      "order_by": "name",
      "order_direction": "ASC",
      "filters": {"name": this.searchField !== '' ? this.searchField : ''}
    };
    console.log(params);
    if (this.isMoreEmployeeDataExists) {
      this.empLoader = true;
      let listfilteredEmp = [];
      this.employeeService.getEmployees(params).pipe(takeUntil(componentDestroyed(this))).subscribe(
        data => {
          listfilteredEmp = data;
        }, (err) => {
          console.log(err);
        },
        () => {
          if (listfilteredEmp.length > 0) {
            for (let i = 0; i < listfilteredEmp.length; i++) {
              this.employeeInfo.push(listfilteredEmp[i]);
            }
          }
          if (listfilteredEmp.length < 50) {
            this.isMoreEmployeeDataExists = false;
          }
          this.empLoader = false;
        }
      );
    }

  }

  setEmpPageByScroll($event): void {
    if ($event && this.isMoreEmployeeDataExists) {
      this.pageNumberForEmp++;
    }
    if (!this.isMoreEmployeeDataExists) {
      this.pageNumberForEmp = 1;
    }
    this.setUserList();
  }

  sendSMS($event): void {
    if (this.selectedMsisdn.length > 0) {
      this.chatAreaLoader = true;
      let params = {
        "msisdns": [this.selectedMsisdn],
        "text": $event
      }
      this.service.sendMessage(params).pipe(takeUntil(componentDestroyed(this))).subscribe(data => {
        if (data.code === 0) {
          this.getChatMessage();
        }
      });
      console.log(params);
    }
  }

  filterEmployeeData(): void {
    this.messageForChat = [];
    this.Employee = [];
    this.pageNumberForEmp = 1;
    this.employeeInfo = [];
    this.isMoreEmployeeDataExists = true;
    this.setUserList();
  }


  ngOnDestroy() {
  }
}
