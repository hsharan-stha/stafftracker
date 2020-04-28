import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppConfigService } from "../../../service/AppConfig.service";

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {
  selectedFile: ImageSnippet;

  @Output() inputChanged: EventEmitter<ImageSnippet> = new EventEmitter();
  /*
  for input file id
   */
  @Input() customID: string;
  /*
  for detail label
   */
  @Input() detailLabel: string;

  fileName: string;

  @Input() imgUrl: any;

  @Input() form_group_name: any;

  @Input() form_control_name: any;

  @Input() labelUpload: string;

  BASEIPURL: string;

  @Input() formSubmitted: boolean = false;

  constructor(private appConfigService: AppConfigService) { }

  ngOnInit() {
    this.BASEIPURL = this.appConfigService.config['base_ip'];
  }
  /*
  for detail label
   */
  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, file);
      // console.log(this.selectedFile);
      // console.log(this.selectedFile.src);
      // this.imageService.uploadImage(this.selectedFile.file).pipe(takeUntil(componentDestroyed(this))).subscribe(
      //   (res) => {

      //   },
      //   (err) => {

      //   })
      this.inputChanged.emit(this.selectedFile);
      this.fileName = imageInput.files[0].name;
      this.imgUrl = reader.result;
    });

    reader.readAsDataURL(file);
  }

  private errorImage = false;
  errorImgHandler(event) {
    this.imgUrl = "";
  }
}
class ImageSnippet {
  constructor(public src: string, public file: File) { }
}