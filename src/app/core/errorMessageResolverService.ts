import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageResolverService {

    isError = true;

    constructor(private http: HttpClient) {

    }
    setError(value: boolean){
        this.isError = value;
    }
    getError(){
        return this.isError;
    }
}