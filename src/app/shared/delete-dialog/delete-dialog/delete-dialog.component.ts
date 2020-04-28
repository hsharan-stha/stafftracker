import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent implements OnInit {
  @Input() containerWidth: string = "";
  @Input() title: string;
  @Input() body: string;
  @Output() confirmBtn: EventEmitter<Boolean> = new EventEmitter();

  @Output() cancelBtn: EventEmitter<Boolean> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  confirmBtnClick() {
    this.confirmBtn.emit(true);
  }

  cancelBtnClick() {
    this.cancelBtn.emit(true);
  }

}
