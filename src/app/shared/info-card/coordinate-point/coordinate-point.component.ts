import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { CoordinatePoint } from './../coordinate-point.model';

@Component({
  selector: 'coordinate-point',
  templateUrl: './coordinate-point.component.html',
  styleUrls: ['./coordinate-point.component.css']
})
export class CoordinatePointComponent implements OnInit {

    @Input() coordinateDtl:CoordinatePoint[];
    @Output() btnCoordinateClicked : EventEmitter<any> = new EventEmitter();
    constructor() { }

    ngOnInit() {
    }

    coordinateClicked(){
        this.btnCoordinateClicked.emit(this.coordinateDtl);
    }

}
