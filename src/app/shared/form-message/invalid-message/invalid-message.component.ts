import {Component, Input, OnInit} from '@angular/core';


@Component({
  selector: 'invalid-message',
  templateUrl: './invalid-message.component.html',
  styleUrls: ['./invalid-message.component.css']
})

export class InvalidMessageComponent implements OnInit {

  @Input() public text;
  @Input() public type;

  public position: string;

  @Input() width: string = "200px";

  @Input() maxWidth: string = "200px";

  public positionTopOrBottom: number = 10;

  public positionRight: number;

  diff: string;

  constructor() {
  }

  ngOnInit() {
  }


}
