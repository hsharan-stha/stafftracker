import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountSetupService {
  _phone;
  public get phone() {
    return this._phone;
  }
  public setPhone(value) {
    this._phone = value;
  }
  private subjectMessage = new Subject<any>();
  getMessage(): Observable<any> {
    return this.subjectMessage.asObservable();
  }

  setMessage(message) {
    this.subjectMessage.next(message);
  }
  constructor() {
  }
}
