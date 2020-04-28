import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() hideData: boolean = true;
  @Input() customClass: string = "sidebar";
  @Input() isCompanyInfoActive: boolean =false;
  showSubData = true;
  constructor() { }

  ngOnInit() {
  }
  
  toggleNotification(showSubData) {
    this.showSubData = !showSubData;
  }
  onToggleChange(e){
    console.log(e);
  }
}
//