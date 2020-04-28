import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {CoordinatePoint} from './../coordinate-point.model';

@Component({
  selector: 'info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.css']
})
export class InfoCardComponent implements OnInit {

  @Input() coordinateDtl: CoordinatePoint[];
  @Output() btnCloseClicked: EventEmitter<string> = new EventEmitter();
  @Output() btnSendMsgClicked: EventEmitter<string> = new EventEmitter();
  @Output() btnViewTrackClicked: EventEmitter<string> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  closeCard() {
    this.btnCloseClicked.emit();
  }

  sendMessage() {
    this.btnSendMsgClicked.emit();
  }

  viewTracking(msisdn) {
    this.btnViewTrackClicked.emit(msisdn);
  }

  errorHandler($event) {
    $event.target.src = "assets/icons/blue_user.svg";
  }

}
