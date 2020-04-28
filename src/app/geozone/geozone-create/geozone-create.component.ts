import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {CommService} from '../../shared/map/services/comm.service';
import {takeUntil} from 'rxjs/operators';
import {componentDestroyed} from 'src/app/core/takeUntil-function';
import {StaticData} from '../StaticData/staticdata.geozone';
import {MessageGeozone} from '../StaticData/message.geozone';
import {AlertMessageService} from "./../../service/alert-message.service";
import {GeozoneService} from '../service/geozone.service';

@Component({
  selector: 'geozone-create',
  templateUrl: './geozone-create.component.html',
  styleUrls: ['./geozone-create.component.css']
})
export class GeozoneCreateComponent implements OnInit {

  geozone_id = null; //id for edit
  //changable page titles as per create/edit page
  mainPage = StaticData.MainPage;
  PageTitle: string = StaticData.AddTitle;
  BlockTitle: string = StaticData.BlockTitle;
  BtnTitle: string = StaticData.SaveBtn;
  address: string;
  addressFirstLine: string;
  addressSecondLine: string;
  btnDisabled: boolean = false;
  isSubmitted: boolean = false;
  showAddressCard: boolean = false;
  loader: boolean = false;

  geozoneForm: FormGroup;
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
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private commService: CommService,
    private alertService: AlertMessageService,
    private geozoneService: GeozoneService
  ) {
    this.route.params.pipe(takeUntil(componentDestroyed(this))).subscribe(params => this.geozone_id = parseInt(params['id']));
  }

  ngOnInit() {
    this.createForm();
    //values to display for edit page
    this.viewGeozoneInfo();
    // end here for edit page
  }

  viewGeozoneInfo() {
    if (this.geozone_id) {
      this.loader = true;
      this.showAddressCard = true;
      this.PageTitle = StaticData.EditTitle;
      this.BlockTitle = StaticData.EditTitle;
      this.BtnTitle = StaticData.UpdateBtn;
      this.geozoneService.getByID(this.geozone_id).pipe(takeUntil(componentDestroyed(this))).subscribe(
        (data) => {
          this.geozoneForm.patchValue({
            geozone_name: data.name,
            geozone_address: data.address,
            geozone_radius: data.radius,
            geozone_color: data.color,
            lat: data.latitude,
            long: data.longitude
          });

          this.commService.setColorCode(data.color);
          this.commService.setCircleRadius(parseInt(data.radius));
          this.commService.setLatLongCenter(parseFloat(data.latitude), parseFloat(data.longitude));

          let addressSplitted = data.address.split(", ");
          let houseNumber = (typeof addressSplitted[0] != "undefined") ? addressSplitted[0] : "";
          let road = (typeof addressSplitted[1] != "undefined") ? ", " + addressSplitted[1] : "";
          let suburb = (typeof addressSplitted[2] != "undefined") ? addressSplitted[2] : "";
          let city = (typeof addressSplitted[3] != "undefined") ? ", " + addressSplitted[3] : "";
          this.addressFirstLine = houseNumber + road;
          this.addressSecondLine = suburb + city;
          if (this.addressFirstLine.slice(0, 1) === ",") {
            this.addressFirstLine = this.addressFirstLine.slice(1, this.addressFirstLine.length);
          }
          if (this.addressSecondLine.slice(0, 1) === ",") {
            this.addressSecondLine = this.addressSecondLine.slice(1, this.addressSecondLine.length);
          }

          this.loader = false;
        },
        error => {
          console.log(error);
        }
      )
    } else {
      this.commService.setColorCode(this.colors[0].code);
      this.geozoneForm.get('geozone_color').setValue(this.colors[0].code);
      this.commService.setCircleRadius(this.geozoneForm.value.geozone_radius);
    }
  }

  createForm(): void {
    this.geozoneForm = this.fb.group({
      geozone_name: ["", [Validators.required]],
      geozone_address: ["", [Validators.required]],
      geozone_radius: [500, [Validators.required]],
      geozone_color: ["", [Validators.required]],
      lat: ["", [Validators.required]],
      long: ["", [Validators.required]]
    });
  }

  storeGeozone() {
    this.isSubmitted = true;
    if (this.geozoneForm.valid) {
      this.btnDisabled = true;
      let data = this.geozoneForm.value;
      if (this.geozone_id != null && this.geozone_id > 0 && this.geozone_id != "") {
        data['id'] = this.geozone_id;
        this.geozoneService.update(data).pipe(takeUntil(componentDestroyed(this))).subscribe(
          data => {
            if (data['code'] === 0) {
              this.success(MessageGeozone.GeozoneUpdated);
            }
            this.btnDisabled = false;
            console.log(data);
          }, error => {
            this.error(error);
            this.btnDisabled = false;
            console.log(error);
          }
        )
      } else {
        this.geozoneService.save(data).pipe(takeUntil(componentDestroyed(this))).subscribe(
          data => {
            if (data['code'] === 0) {
              this.success(MessageGeozone.GeozoneAdded);
              this.btnDisabled = false;
            }
            console.log(data);
          }, error => {
            this.error(error);
            this.btnDisabled = false;
            console.log(error);
          }
        )
      }
      //this.router.navigate(['main/geozones']);
    }
  }

  singleClickOnMap($event) {
    this.showAddressCard = true;
    console.log($event);
    this.geozoneForm.get('long').setValue($event[0]);
    this.geozoneForm.get('lat').setValue($event[1]);
    // this.commService.getCoordinateLIST().pipe(takeUntil(componentDestroyed(this))).subscribe(data=>{
    this.commService.getAddressFromLat($event).pipe(takeUntil(componentDestroyed(this))).subscribe(
      data => {
        let houseNumber = (typeof data.address.house_number != "undefined") ? data.address.house_number + ", " : "";
        let road = (typeof data.address.road != "undefined") ? data.address.road : "";
        let suburb = (typeof data.address.suburb != "undefined") ? data.address.suburb + ", " : "";
        let city = (typeof data.address.city != "undefined") ? data.address.city : "";

        this.address = houseNumber + road + ", " + suburb + city;
        this.addressFirstLine = houseNumber + road;
        this.addressSecondLine = suburb + city;
        this.geozoneForm.get('geozone_address').setValue(this.address);
        console.log(this.address);
      },
      err => {
        console.log(err);
      }
    );
    //},
//        err=>{
//            console.log(err);
//        })
  }

  btnBackClicked() {
    this.router.navigate(['main/geozones']);
  }

  selectedColor(color) {
    this.geozoneForm.get('geozone_color').setValue(color.code);
    this.commService.setColorCode(color.code);
  }

  radiusRangeChanged() {
    this.commService.setCircleRadius(this.geozoneForm.get('geozone_radius').value);
  }

  ngOnDestroy(): void {
  }

  redirectMainPage() {
    this.router.navigate([this.mainPage]);
  }

  success(message): void {
    this.alertService.show({
      message: message,
      alertType: "success"
    });
    this.redirectMainPage();
  }

  error(err): void {
    this.alertService.show({
      message: err.error.result,
      alertType: "error"
    });
  }

  clickLocationMarker() {
    this.commService.setCursorPointer(true);
  }
}
