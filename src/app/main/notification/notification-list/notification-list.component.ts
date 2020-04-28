import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit {
    positionForm: FormGroup;
    collection = [];
    notifyList = [
      {id: 1, position: 'Notification about the Employee’s lateness'},
      {id: 2, position: 'Notification about the Employee’s critical lateness'},
      {id: 3, position: "Notification about the Employee’s premature leaving from work"}
    ];
    notifyList2 = [
      {id: 1, position: 'Notification about being late for work'},
      {id: 2, position: 'Notification about a critical lateness to work (with an explanation note request)'},
      {id: 3, position: "Notification about premature leaving from work"}
    ];
    groups = [
        { id:1, name:'Name of Group' },
        { id:2, name:'Group' },
        { id:3, name:'Chief Group ' },
        { id:4, name:'Chief Group ' },
        { id:5, name:'Chief Group ' },
        { id:6, name:'Project Group' },
        { id:7, name:'Project Group' },
        { id:8, name:'Group' },
      ];
      filteredGroups = this.groups;
  constructor(
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
      this.createForm();
      for (let i = 1; i <= 8; i++) {
              this.collection.push(i);
          }
  }
  createForm() : void {
    this.positionForm = this.fb.group({
        name : ["",[Validators.required]],
    });
  }

    editNotificationEmployeer(){
        this.router.navigate(['/main/notification']);
    }
    editNotificationEmployees(){
        this.router.navigate(['/main/notification/servicenotification']);
    }
}

//EEF3F5  
