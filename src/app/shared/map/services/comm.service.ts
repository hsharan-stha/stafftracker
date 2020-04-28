import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject, Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConfigService} from "../../../service/AppConfig.service";
import {map} from 'rxjs/operators';
import {takeUntil} from 'rxjs/operators';
import {componentDestroyed} from 'src/app/core/takeUntil-function';

@Injectable({
  providedIn: 'root'
})
export class CommService {
  private URL: string;
  private queryString: string = "?format=jsonv2&";
  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();
  private color = new BehaviorSubject([]);
  getColor = this.color.asObservable();
  private circleRadius = new BehaviorSubject([]);
  getCircleRadius = this.circleRadius.asObservable();
  private movementList = new BehaviorSubject([]);
  getMovementList = this.movementList.asObservable();
  private CursorPointer = new BehaviorSubject([]);
  getCursorPointer = this.CursorPointer.asObservable();
  private latLongCenter = new BehaviorSubject<any>([]);
  getLatLongCenter = this.latLongCenter.asObservable();
  private coordinateLIST = new BehaviorSubject([]);
  private fullAddressList = new BehaviorSubject([]);

  constructor(private http: HttpClient, private appConfigService: AppConfigService) {
  }

  changeMessage(message: string) {
    console.log(message);
    this.messageSource.next(message);
  }

  setColorCode(colorCode: any) {
    this.color.next(colorCode);
  }

  setCircleRadius(radius: any) {
    this.circleRadius.next(radius);
  }

  setMovementList(list: any) {
    this.movementList.next(list);
  }

  setCursorPointer(list: any) {
    this.CursorPointer.next(list);
  }


  setLatLongCenter(lat, long) {
    this.latLongCenter.next({
      latitude: lat,
      longitude: long
    });
  }


  setCoordinateLIST(LIST) {
    this.coordinateLIST.next(LIST);
  }

  getCoordinateLIST(): Observable<any> {
    return this.coordinateLIST.asObservable();
  }

  getURL(params): string {
    this.URL = this.appConfigService.config['map_url'] + this.queryString;
    return this.URL + params;
  }

  getAddressFromLat(lat): Observable<any> {
    let params = "lon=" + lat[0] + "&lat=" + lat[1];
    return this.http.post(this.getURL(params), []).pipe(
      map((data: any[]) => {
        return data;
      })
    );
  }


  setAddressFromLatLong(lat) {
    this.getAddressFromLat(lat).pipe(takeUntil(componentDestroyed(this))).subscribe(
      data => {
        data['latLong'] = lat;
        this.fullAddressList.next(data);
      },
      error => {
        console.log(error);
      }
    );
  }

  ngOnDestroy(): void {
  }

  getAddressFromLatLong(): Observable<any> {
    return this.fullAddressList.asObservable();
  }
}
