import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  Renderer2,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {componentDestroyed} from 'src/app/core/takeUntil-function';
import {BehaviorSubject, Observable} from 'rxjs';

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.css'],
  host: {
    '(document:click)': 'onClick($event)',
  },
})

export class SelectInputComponent implements OnInit, OnChanges {
  _eref;
  @Input() selectInputControl: any;
  @Input() selectInputGroup: any;
  @Input() selectOptions: Array<object>;
  @Input() selectorId: string;
  @Input() formSubmitted: boolean = false;
  @Input() isSetGeozone: string;
  @Output() inputChanged: EventEmitter<string> = new EventEmitter();
  @Output() dropDownScroll: EventEmitter<boolean> = new EventEmitter();
  @Input() emptySelectOption: boolean = true;
  showOption: Boolean = false;
  selectedValue = null;

  constructor(
    private _erefRef: ElementRef,
    private renderer: Renderer2
  ) {
  }

  ngOnInit() {
    this._eref = this.renderer.selectRootElement(this._erefRef);
    this.onValueChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (typeof changes.selectOptions != "undefined" &&
      typeof changes.selectOptions.currentValue != "undefined" &&
      changes.selectOptions.currentValue.length > 0) {
      if (this.isSetGeozone) {
        this.checkIfSettedGeozone();
      }
      this.onChanges();
    }
  }
  
  onValueChanges(): void {
    this.selectInputControl.valueChanges.subscribe(val=>{
        if(val=="" || val==null){
            this.selectedValue = false;
        }
    })
  }

  onChanges() {
    this.selectInputControl.valueChanges
      .pipe(takeUntil(componentDestroyed(this)))
      .subscribe(val => {
        let actualValue = val;
        let identifier = this.selectorId;
        this.selectedValue = this.selectOptions.filter(function (el: any) {
          return ((el.id == actualValue) || (el[identifier] == actualValue));
        })[0];
      });
  }

  select(selected) {
    this.showOption = false;
    this.selectedValue = selected;
    let valueOfSelect = (selected != "" && typeof selected[this.selectorId] != 'undefined' && selected[this.selectorId] != "") ? selected[this.selectorId] : ((typeof selected.id != "undefined") ? selected.id : "");
    this.inputChanged.emit(valueOfSelect);
    if (valueOfSelect == "") {
      this.selectInputControl.markAsTouched();
    }
    this.selectInputControl.setValue(valueOfSelect);
  }

  onClick(event) {
    if (!this._eref.nativeElement.contains(event.target)) // or some similar check
      this.showOption = false;
  }

  checkIfSettedGeozone() {
    let data = this.selectOptions.filter((x: any) => x.id === this.isSetGeozone.toString());
    this.selectedValue = data[0];
  }

  setPageByScroll($event) {
    this.dropDownScroll.emit($event);
  }

  ngOnDestroy(): void {
  }

}
