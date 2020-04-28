import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { of } from "rxjs";
import { delay } from "rxjs/operators";
import { ErrorMessageResolverService } from './errorMessageResolverService';
@Injectable()
export class ErrorMessageResolver implements Resolve<Observable<string>> {
    constructor(private errorMessageResolverService: ErrorMessageResolverService) { }
    resolve(): Observable<any> {
        console.log('rsolve');
        if(this.errorMessageResolverService.isError){
            return of('aaaa ').pipe(delay(0));
        }
        
    }
}

