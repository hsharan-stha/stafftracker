import {Injectable, Inject} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {fromEvent} from 'rxjs';
import {debounceTime, map, takeUntil} from 'rxjs/operators';
import {componentDestroyed} from 'src/app/core/takeUntil-function';


export interface WindowSize {
    targetElementEvent: any
};

export interface tableRows {
    rows: number
}

@Injectable()
export class GetWindowHeightService {

    selectedElement;
    headerHeight;
    rowHeight;
    tableType;
    secondTableRowHeight;

    constructor(@Inject('windowObject') private window: Window) {

        fromEvent(window, 'resize').pipe(
            debounceTime(100),
            map(event => {
                console.log(event);
                let windowData = <WindowSize>{
                    targetElementEvent: event
                }
                return windowData;
            }))
            .pipe(takeUntil(componentDestroyed(this))).subscribe((windowSize) => {
            if ((typeof this.selectedElement) === "object")
                this.calculationRows();
//            let innerHeight = windowSize.targetElementEvent.target.innerHeight;
        })

    };

    readonly windowSizeChanged = new BehaviorSubject<tableRows>(<tableRows>{
        rows: 20
    });

    getData(selectedElement, headerHeight, rowHeight, tableType = null, secondTableRowHeight = null) {
        this.tableType = tableType;
        this.selectedElement = selectedElement;
        this.headerHeight = headerHeight;
        this.rowHeight = rowHeight;
        this.secondTableRowHeight = secondTableRowHeight;
        this.calculationRows();
    }


    calculationRows() {
        let innerHeight = this.window.innerHeight;
        let tableTopPosition = this.selectedElement.nativeElement.getBoundingClientRect().top;
//        let paginationHeight = 40;
        let paginationHeight = 55;
        let tblRowHeight;
        if (this.tableType != null && this.tableType == "timeTrackingReport" && this.window.innerWidth <= 1475) {
            tblRowHeight = this.secondTableRowHeight;
        } else if (this.tableType != null && this.tableType == "notificationExReport" && this.window.innerWidth <= 1060) {
            tblRowHeight = this.secondTableRowHeight;
        } else {
            tblRowHeight = this.rowHeight;
        }

        let usedTopValued = tableTopPosition + this.headerHeight + paginationHeight;
        let remainingHeight = innerHeight - usedTopValued - 5;
        let numberOfRows: number = Math.floor(remainingHeight / tblRowHeight);
        let totalRows = (numberOfRows > 2) ? numberOfRows : 2;
        this.windowSizeChanged.next(<tableRows>{rows: totalRows});
    }

    ngOnDestroy(): void {
    }
}

//