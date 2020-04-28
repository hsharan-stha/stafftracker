import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  Renderer2,
  OnChanges,
  SimpleChanges, Output, EventEmitter
} from '@angular/core';
import {ChatService} from '../../../service/chat.service';
import {Message} from 'src/app/models/message';


@Component({
  selector: 'input-message-box',
  templateUrl: './input-message-box.component.html',
  styleUrls: ['./input-message-box.component.css']
})
export class InputMessageBoxComponent implements OnInit, OnChanges, AfterViewChecked {
  myScrollContainer;
  sendingMessage = new Message();
  messages: Message[] = [];
  message: string;
  @Input() displayEmpInfo;
  @Input() messageForChat;
  @Input() Employee;
  @Input() chatAreaLoader: boolean = false;
  @Output() sendSMS = new EventEmitter();
  @ViewChild('scrollMe') private myScrollContainerRef: ElementRef;
  scrollAtBottom: boolean = false;

  constructor(
    private chatService: ChatService,
    private renderer: Renderer2
  ) {
  }


  ngOnInit() {
    this.myScrollContainer = this.renderer.selectRootElement(this.myScrollContainerRef);
    // console.log("input message");
    // this.chatService.getMessages()
    //   .subscribe((message) => {
    //     this.messages.push(message);
    //     // this.scrollToBottom();
    //
    //   });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (typeof changes['messageForChat'] !== "undefined") {
      this.scrollAtBottom = false;
    }
  }

  sendMessage() {
    this.sendSMS.emit(this.message);
    this.message = '';

    // this.sendingMessage.senderId = 1;
    // this.sendingMessage.receiverId = 3;
    // this.sendingMessage.message = this.message;
    // this.sendingMessage.sendTime = Date.now();
    // this.chatService.sendMessage(this.sendingMessage);
    // this.message = '';

  }

  ngAfterViewChecked() {
    // console.log("after checked");
    if (!this.scrollAtBottom)
      this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      // console.log(this.myScrollContainer.nativeElement);
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

  setPageByScroll($event) {
    this.scrollAtBottom = $event;
  }
}
