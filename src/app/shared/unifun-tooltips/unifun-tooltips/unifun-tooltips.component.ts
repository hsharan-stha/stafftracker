import {Component, OnInit  } from '@angular/core';

@Component({
  selector: 'unifun-tooltips',
  templateUrl: './unifun-tooltips.component.html',
  styleUrls: ['./unifun-tooltips.component.css'],
  host : {
      '[id]' : 'id'
  }
})

export class UnifunTooltipsComponent implements OnInit {

    id : string ; 

    public text  ;

    public position : string ;

    public width : number  ;

    public maxWidth :  number ;

    public positionLeft : number ;

    public positionTopOrBottom : number ;

    public positionRight : number ;

    diff : string ;

    transformD;

    constructor() { }

    ngOnInit() { 
        this.transformD = 'translate3d('+this.positionLeft+'px,'+this.positionTopOrBottom+'px, 0px)';
    }
     


}
