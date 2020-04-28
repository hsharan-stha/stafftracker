import {Component, OnInit, HostListener, ViewChild, ElementRef} from '@angular/core';
import {NotificationService} from 'src/app/service/notification.service';
import {DataService} from './../../service/data.service';
import {Router, NavigationEnd} from '@angular/router';
import {filter, takeUntil} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {AuthenticationService} from 'src/app/service/authentication.service';
import {componentDestroyed} from 'src/app/core/takeUntil-function';
import {interval} from "rxjs";
import {GeoLocationService} from "../../service/geo-location.service";
import {CommService} from "@shared/map/services/comm.service";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  notifications;
  // notification: Notification;
  hideData = false;
  hideUserBar = true;
  hideNotificationBar = false;
  showSubData = true;
  dashboardDisabled;
  isCompanyInfoActive: boolean = false;
  selectedLanguage = "En";
  forExtraSmallScreen = false;
  showEmpActionList = false;
  smsWindowDisplay = false;
  innerWidth;
  todayTime;
  location: any;
  @ViewChild('userPanelWrapper') userPanelWrapper: ElementRef;
  @ViewChild('notifyPanelWrapper') notifyPanelWrapper: ElementRef;

  constructor(
    private notificationService: NotificationService,
    public data: DataService,
    private router: Router,
    private translateService: TranslateService,
    private authenticationService: AuthenticationService,
    private geoLocation: GeoLocationService,
    private commService: CommService
  ) {
  }

  ngOnInit() {
    this.getAddress();
    this.adjustWidth();
    this.subscribeNotification();
    this.data.dashboardData.pipe(takeUntil(componentDestroyed(this))).subscribe(data => {
      this.dashboardDisabled = data;
    });
    this.router.events.pipe(filter(event => event instanceof NavigationEnd,
      takeUntil(componentDestroyed(this)))).subscribe((event: NavigationEnd) => {
      this.findWhichFormOpen(event.url);
    });
    this.findWhichFormOpen(this.router.url);
    if (this.translateService.currentLang)
      this.selectedLanguage = this.translateService.currentLang;

  }

  ngOnDestroy(): void {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.adjustWidth();
  }


  adjustWidth(): void {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 460) {
      this.forExtraSmallScreen = true;
    } else {
      this.forExtraSmallScreen = false;
    }
  }

  toggleBar(hideData) {
    this.hideData = !hideData;
  }

  getWidth() {
    if (this.hideData === true) {
      return 216;
    } else {
      return 80;
    }
  }

  toggleUser(hideUserBar) {
    this.showEmpActionList = false;
    if (this.userPanelWrapper.nativeElement.classList.contains('close-panel')) {
      this.userPanelWrapper.nativeElement.classList.remove('close-panel');
    } else {
      this.userPanelWrapper.nativeElement.classList.add('close-panel');
    }

  }

  toggleNotification(hideNotificationBar) {
    this.showEmpActionList = false;
    if (this.notifyPanelWrapper.nativeElement.classList.contains('close-panel')) {
      this.notifyPanelWrapper.nativeElement.classList.remove('close-panel');
    } else {
      this.notifyPanelWrapper.nativeElement.classList.add('close-panel');
    }
//        this.hideNotificationBar = !hideNotificationBar;
  }

  toggleNotificationMenu(showSubData) {
    this.showSubData = !showSubData;
  }


  hideDashboardContent() {
    this.data.updateDashboardData((typeof this.dashboardDisabled != "undefined") ? !this.dashboardDisabled : true);
  }


  private findWhichFormOpen(url: string) {
    let explode = url.split("/");
    this.isCompanyInfoActive = false;
    this.smsWindowDisplay = false;
    this.data.updateDashboardData(false);

    if (explode[explode.length - 1] != "main") {
      this.data.updateDashboardData(true);
    }

    if (explode[explode.length - 1] == 'company-info') {
      this.isCompanyInfoActive = true;
    }
    if (explode[explode.length - 1] == 'sms') {
      this.smsWindowDisplay = true;
    }
    // console.log(explode);
    // console.log(explode[explode.length - 1]);
  }


  languageChanges(lang: string, $event): void {
    localStorage.setItem("language", lang);
    this.selectedLanguage = lang;
    this.translateService.use(lang);
    $event.preventDefault();
  }

  displayEmpSubAction() {
    this.showEmpActionList = !this.showEmpActionList;
  }

  logOut() {
    this.authenticationService.logout()
      .pipe(takeUntil(componentDestroyed(this))).subscribe(
      data => {
        console.log(data);
        this.authenticationService.onUnauthorized();
        this.router.navigate(['/']);
      },
      err => {
        console.log('error in componenet');
        this.authenticationService.onUnauthorized();
        this.router.navigate(['/'])
      },
      () => []
    );
  }

  getNotifications(): void {
    this.notificationService.getAll().pipe(takeUntil(componentDestroyed(this))).subscribe(data => {
      this.notifications = data;
    })
  }

  getTodayTime() {
    var today = new Date();
    var att = today.getMinutes() > 9 ? '' : "0";
    this.todayTime = today.getHours() + " : " + att + today.getMinutes();
    // this.getAddress();
    // console.log(this.location);
  }

  getAddress(): void {
    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        (res: any) => {
          this.commService.getAddressFromLat({
            '0': res.coords.longitude,
            '1': res.coords.latitude
          }).pipe(takeUntil(componentDestroyed(this))).subscribe(data => {
            this.location = data.address.city + "," + data.address.country;
          });
          // this.geolocationPosition = position,
          console.log(res)
        },
        error => {
          switch (error.code) {
            case 1:
              console.log(error);
              console.log('Permission Denied');
              break;
            case 2:
              console.log('Position Unavailable');
              break;
            case 3:
              console.log('Timeout');
              break;
          }
        }
      );
    }
  }

  subscribeNotification(): void {
    this.getNotifications();
    this.getTodayTime();
    //trigger every 30 sec
    interval(30000).pipe(takeUntil(componentDestroyed(this))).subscribe(() => {
      this.getNotifications();
      this.getTodayTime();
    });
  }
}
