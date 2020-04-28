import {Component, OnInit, Input} from '@angular/core';
import {Notification} from '../../models/Notification';

@Component({
  selector: 'notification-block',
  templateUrl: './notification-block.component.html',
  styleUrls: ['./notification-block.component.css']
})
export class NotificationBlockComponent implements OnInit {
  className = "intime-icon";
  @Input() notification: Notification;

  constructor() {
  }

  ngOnInit() {
    this.checkNotifyType()
  }

  checkNotifyType(): void {
    let type = this.notification.type;
    console.log(type.includes('late') || type.includes("Prematurely"));
    if (type.includes('late') || type.includes("prematurely")) {
      this.className = 'late-icon';
    } else if (type.includes('On time')) {
      this.className = 'intime-icon';
    } else if (type.includes('added') || type.includes('renamed')) {
      this.className = 'add_icon';
    } else if (type.includes('removed')) {
      this.className = 'remove_icon';
    } else if (type.includes('updated')) {
      this.className = 'update_icon';
    } else if (type.includes('Received')) {
      this.className = 'search_permission_icon';
    } else if (type.includes('Forbidden')) {
      this.className = 'search_forbidden_icon';
    } else if (type.includes('Search')) {
      this.className = 'search_location_icon';
    } else if (type.includes('Message')) {
      this.className = 'message-icon';
    } else {
      this.className = '';
    }
  }
}
