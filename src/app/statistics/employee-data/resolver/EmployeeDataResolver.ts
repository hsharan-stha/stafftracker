import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { of } from "rxjs";
import { delay, map } from "rxjs/operators";

@Injectable()
export class EmployeeDataResolver implements Resolve<Observable<string>> {
    constructor() { }
    resolve(): Observable<any> {
        let a = of([1]).pipe(delay(1000));
        let b = of([1, 2, 3]).pipe(delay(2000));
        let c = of([1, 2, 3, 4]).pipe(delay(2000));

       // return of(' test').pipe(delay(1));
        let join = forkJoin(a,b,c).pipe(map((allResponses) => {
            return {
              A: allResponses[0],
              B: allResponses[1],
              C: allResponses[2]
            };
          }));
         
          return join;

    }
}

