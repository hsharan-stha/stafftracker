import {Component, OnInit, EventEmitter, Output, HostListener} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {CommService} from '@shared/map/services/comm.service';
import {takeUntil} from 'rxjs/operators';
import {componentDestroyed} from 'src/app/core/takeUntil-function';
import {KeyCode} from './../../key-code.model';

@Component({
  selector: 'app-geozone-info',
  templateUrl: './geozone-info.component.html',
  styleUrls: ['./geozone-info.component.css']
})
export class GeozoneInfoComponent implements OnInit {
  geozone: FormGroup;
  @Output() nextClicked: EventEmitter<any> = new EventEmitter();
  @Output() backClicked: EventEmitter<any> = new EventEmitter();
  address: string;

  colors = [
    {id: 1, code: '#FF9B54'},
    {id: 2, code: '#F7C137'},
    {id: 3, code: '#D63649'},
    {id: 4, code: '#8C54FF'},
    {id: 5, code: '#00C1D4'},
    {id: 6, code: '#2E5BFF'},
    {id: 7, code: '#A92EFF'},
    {id: 8, code: '#FF2EAF'},
    {id: 9, code: '#2EE9FF'},
  ]

  constructor(
    private formBuilder: FormBuilder,
    private commService: CommService
  ) {
  }

  ngOnInit() {
    this.geozone = this.formBuilder.group({
      'geozone': ['', Validators.required],
      'address': ['', Validators.required],
      'radius': [500, [Validators.required]],
      'color': ['', [Validators.required]]
    });

    this.commService.setColorCode(this.colors[0].code);
    this.geozone.get('color').setValue(this.colors[0].code);
    this.commService.setCircleRadius(this.geozone.value.radius);
    this.settingAddress();
  }

  ngAfterContentInit() {

  }

  settingAddress() {
    this.commService.getAddressFromLatLong().pipe(takeUntil(componentDestroyed(this))).subscribe(
      data => {
        if (data.address) {
          let houseNumber = (typeof data.address.house_number != "undefined") ? data.address.house_number + ", " : "";
          let road = (typeof data.address.road != "undefined") ? data.address.road : "";
          let suburb = (typeof data.address.suburb != "undefined") ? data.address.suburb + ", " : "";
          let city = (typeof data.address.city != "undefined") ? data.address.city : "";

          this.address = houseNumber + road + ", " + suburb + city;
          this.geozone.get('address').setValue(this.address);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  btnBackClicked() {
    this.backClicked.emit();
    //this.router.navigate(['account-setup/schedule']);
  }

  btnNextClicked() {
    this.nextClicked.emit(this.geozone);
    //this.router.navigate(['get-started-page']);
  }

  onColorChange(color) {
    this.geozone.get('color').setValue(color.code);
    this.commService.setColorCode(color.code);
  }

  radiusRangeChanged() {
    this.commService.setCircleRadius(this.geozone.get('radius').value);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event);

    if (event.keyCode === KeyCode.ENTER_KEY) {
      this.btnNextClicked();
    }
  }

  clickLocationMarker() {
    this.commService.setCursorPointer(true);
  }

  ngOnDestroy() {
  }
}
