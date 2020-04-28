import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {EmployeeModel, EmployeeTblModel} from "../model/employee.model";
import {AppConfigService} from "../../service/AppConfig.service";
import {EmployeeAdapter, EmployeeTblAdapter} from "../adapter/employee.adapter";
import {ExtraParamsAdapter} from "@shared/adapter/extraParams.adapter";

@Injectable()
export class EmployeeService {
  private URL: string;
  private queryString: string = "?action=";
  private getMethod = "get_employees";
  private getFreeEmployeeMethod = "get_free_employee";
  private getGroupEmployee = "get_employee_from_group";
  private insertMethod = "insert_employee";
  private deleteMethod = "delete_employee";
  private updateMethod = "update_employee";

  constructor(
    private appConfigService: AppConfigService,
    private http: HttpClient,
    private employeeAdapter: EmployeeAdapter,
    private employeeTblAdapter: EmployeeTblAdapter,
    private employeeTblExtraAdapter: ExtraParamsAdapter
  ) {
  }


  getBaseIPURL(): string {
    return this.appConfigService.config['base_ip'];
  }

  getURL(action: string): string {
    this.URL = this.appConfigService.config['base_url'] + this.queryString;
    return this.URL + action;
  }

  getEmployees(data): Observable<EmployeeTblModel[]> {
    let method = data.type ? (data.type === "group_employee" ? this.getGroupEmployee : this.getFreeEmployeeMethod) : this.getMethod;
    return this.http.post<EmployeeTblModel[]>(this.getURL(method), this.employeeTblExtraAdapter.adapt(data)).pipe(
      map((data: any[]) => {
          if (typeof data['result'] === 'number') {
            return data['result'];
          } else if (data['code'] === 0) {
            return data['result'].map((data: any[]) => this.employeeTblAdapter.adapt(data));
          }
        }
      )
    );

  }

  saveEmployees(data): Observable<any> {
    console.log(data);
    return this.http.post(this.getURL(this.insertMethod), data).pipe();
  }

  updateEmployees(data): Observable<any> {
    return this.http.post(this.getURL(this.updateMethod), data).pipe();
  }

  getEmployeeByID(employeeID): Observable<any> {
    let params = {
      "id": employeeID,
      "page_number": 1
    };

    return this.http.post(this.getURL(this.getMethod), params).pipe(
      map((data: any[]) => {
        return this.employeeAdapter.adapt(data['result'][0]);
      })
    );
  }

  removeEmployee(employeeID): Observable<any> {
    let params = {
      "id": employeeID,
    }
    return this.http.post(this.getURL(this.deleteMethod), params);
  }

  private notify = new BehaviorSubject([]);

  getNotify(): Observable<any> {
    return this.notify.asObservable();
  }

  setNotify(data): void {
    this.notify.next(data);
  }
}
