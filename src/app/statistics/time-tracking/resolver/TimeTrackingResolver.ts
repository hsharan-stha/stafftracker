import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { of } from "rxjs";
import { catchError } from 'rxjs/operators';
import { delay, map, takeUntil } from "rxjs/operators";
import { GroupService } from 'src/app/group/service/group.service';
import { componentDestroyed } from 'src/app/core/takeUntil-function';
import { EmployeeService } from 'src/app/employee/service/employee.service';

@Injectable()
export class TimeTrackingResolver implements Resolve<Observable<string>> {
  constructor(
    private groupService: GroupService,
    private employeeService: EmployeeService


  ) { }
  resolve(): Observable<any> {
    let tableParam = {
      "page_number": 1,
      "order_by": 'name',
      "order_direction": "ASC"
    };

    let join = forkJoin(
      this.groupService.getAll(tableParam).pipe(catchError(() => {
        return of('');
      })),
      this.employeeService.getEmployees(tableParam).pipe(catchError(() => {
        return of('');
      }))
      )
      .pipe(map((allResponses) => {
        return {
          group_all: allResponses[0],
          employee_all: allResponses[1]
        };
      }));

    return join;

  }
}

