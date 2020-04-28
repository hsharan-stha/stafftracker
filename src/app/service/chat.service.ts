import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

    private url = 'http://localhost:1300';
    private socket;

    constructor(private http: HttpClient) {
        this.socket = io(this.url);
    }

    public sendMessage(message) {
        // this.socket.emit('new-message', JSON.stringify(message));
        this.socket.emit('new-message', message);
    }

    public getMessages = () => {
        return Observable.create((observer) => {
            this.socket.on('new-message', (message) =>{
                observer.next(message);
            });
        });
    }

    public getUserMessageList(){
        return this.http.get("http://localhost:4000/users");
    }
}
