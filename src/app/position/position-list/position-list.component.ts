import {
    Component,
    OnInit,
    HostListener,
    ViewChild,
    ElementRef,
    OnDestroy
} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PositionService} from "../service/position.service";
import {Position} from "../model/position.model";
import {Staticdata} from "../StaticData/staticdata.position";
import {GetWindowHeightService} from "../../service/get-window-height.service";
import {takeUntil} from 'rxjs/operators';
import {componentDestroyed} from 'src/app/core/takeUntil-function';

@Component({
    selector: 'position-list',
    templateUrl: './position-list.component.html',
    styleUrls: ['./position-list.component.css']
})
export class PositionListComponent implements OnInit, OnDestroy {

    searchForm: FormGroup;
    positions: Position[];
    filteredPositions: Position[];
    countRow: number;
    innerWidth;
    laptopSize: boolean = false;
    createPage = Staticdata.CREATEPAGE;
    loader: boolean = false;
    p: number = 1;
    showExpandBtn = true;
    perPageItem = 20;
    totalCount;
    $windowSizeChanged;
    fieldName: string = "name"; //for sorting
    sortingParams;
    @ViewChild('positionTable') elementView: ElementRef;
    hoverCheckBox: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private service: PositionService,
        private getWindowHeightService: GetWindowHeightService) {
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.adjustWidth();
    }

    ngOnInit() {
        this.initSortingParams();
        setTimeout(() => {
            this.initTable();
        }, 20);
        this.initForm();
        this.adjustWidth();
        this.onDelete();
        this.forExpandAndPagination();
    }

    ngOnDestroy(): void {
        // this.$windowSizeChanged.unsubscribe();
    }

    initSortingParams(): void {
        this.sortingParams = {
            "order_by": this.fieldName,
            "order_direction": "ASC"
        };
    }

    onDelete(): void {
        this.service.getNotify().pipe(takeUntil(componentDestroyed(this))).subscribe(
            (data) => {
                if (data === true) {
                    this.getPositionData();
                    this.forExpandAndPagination();
                }
            }
        )
    }

    initTable() {
        let tableHeaderHeight = 42;
        let tableRowsHeight = 70;
        this.getWindowHeightService.getData(this.elementView, tableHeaderHeight, tableRowsHeight, "positionTbl");
        this.$windowSizeChanged = this.getWindowHeightService.windowSizeChanged.pipe(takeUntil(componentDestroyed(this))).subscribe(
            value => {
                this.perPageItem = value.rows;
                this.getPositionData();

            }
        );
    }

    getPositionData(): void {
        let params = {
            "limit": this.perPageItem,
            "page_number": this.p,
            "order_by": this.sortingParams.order_by,
            "order_direction": this.sortingParams.order_direction,
            "filters": this.searchForm.valid && this.searchForm.value.position_name ? {"name": this.searchForm.value.position_name} : {}
        };
        this.loader = true;
        this.getPositions(params);
    }

    expandTable() {
        this.showExpandBtn = false;
        // this.forExpandAndPagination();
    }

    forExpandAndPagination() {
        let params = {
            "limit": 1,
            "page_number": 0,
            "filters": this.searchForm.valid && this.searchForm.value.position_name ? {"name": this.searchForm.value.position_name} : {}
        };
        this.getPositions(params);
    }

    getPositions(params) {
        this.service.getAll(params).pipe(takeUntil(componentDestroyed(this))).subscribe(
            data => {
                if (typeof data === "number") {
                    this.totalCount = data;
                    this.countRow = data;
                    return false;
                }
                this.positions = data;
                this.filteredPositions = this.positions;
                this.loader = false;
            }
        );
    }

    adjustWidth(): void {
        this.innerWidth = window.innerWidth;
        if (this.innerWidth <= 1100) {
            this.laptopSize = true;
        } else {
            this.laptopSize = false;
        }
    }


    initForm() {
        this.searchForm = this.formBuilder.group({
            'position_name': ['', Validators.minLength(3)]
        })
    }

    addPositionView() {
        this.router.navigate([this.createPage]);
    }

    findPosition() {
        if (this.searchForm.valid) {
            //         //     //     let filterKey = this.searchForm.value.position_name.toLowerCase();
            //         //     //     this.filteredPositions = this.positions.filter(function (position) {
            //         //     //         return position.name.toLowerCase().indexOf(filterKey) > -1;
            //         //     //     });
            //         //     //     if (this.filteredPositions.length === 0) {
            //         //     //         this.showExpandBtn = true;
            //         //     //         this.p = 1;
            //         //     //         this.forExpandAndPagination();
            //         //     //         this.getPositionData();
            //         //     //     } else {
            //         //     //         this.totalCount = this.filteredPositions.length;
            //         //     //         this.countRow = this.filteredPositions.length;
            //         //     //     }
            //         //     // } else {
            //         //     //     this.showExpandBtn = true;
            this.forExpandAndPagination();
            this.getPositionData();
        }
        // this.forExpandAndPagination();
        // this.getPositionData();

    }

    editPositionInformation(id) {
        this.router.navigate([Staticdata.MAINPAGE + id]);
    }

    deletePosition(id) {
        this.router.navigate([Staticdata.MAINPAGE + "/delete/" + id]);
    }


    pageNumber($event): void {
        this.p = $event;
        this.searchForm.get("position_name").setValue('');
        this.getPositionData();

    }

    sortItems($event): any {
        this.sortingParams = {
            "order_by": $event.order_by,
            "order_direction": $event.order_direction
        };
        this.getPositionData();
    }

    filterValue($value) {
        if ($value === "") {
            this.forExpandAndPagination();
            this.getPositionData();
        }
    }
    
    setCheckBoxHover($event) {
        this.hoverCheckBox = $event;
    }
}

