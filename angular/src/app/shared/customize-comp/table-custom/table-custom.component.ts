import {
    Component,
    ContentChildren,
    EventEmitter,
    Input,
    OnInit,
    Output,
    QueryList,
    ViewEncapsulation,
} from "@angular/core";
import { NzSafeAny } from "ng-zorro-antd/core/types";
import { Subject } from "rxjs";
import { TableColumnDirective } from "./directives/table-column.directive";
import { Dictionary } from "./models/types";
import { coerceBooleanProperty } from "@node_modules/@angular/cdk/coercion";

@Component({
    selector: "table-custom",
    templateUrl: "./table-custom.component.html",
    styleUrls: ["./table-custom.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class TableCustomComponent implements OnInit {
    showPagination = true;
    private _rows: Dictionary[] = [];
    @Input() set rows(v: Dictionary[]) {
        this._rows = v ? v : [];
        this.refreshCheckStatus(this.rows);
    }

    get rows() {
        return this._rows;
    }

    @Input() page = 1;
    @Input() pageSize = 10;
    @Input() totalRows = 0;
    @Input() isLoading = false;
    @Input() pageSizeOptions: number[] = [5, 10, 20, 50, 100, 200];
    @Input() ordPaginationSize: "default" | "sm" | "md" = "default";
    _hiddenHeader = false;
    @Input()
    get hiddenHeader() {
        return this._hiddenHeader;
    }

    set hiddenHeader(value: boolean) {
        this._hiddenHeader = coerceBooleanProperty(value);
    }
    @Input() scroll: {
        x?: string | null;
        y?: string | null;
    };

    @Input()
    get paginationSimple() {
        return this._paginationSimple;
    }

    set paginationSimple(value: boolean) {
        this._paginationSimple = coerceBooleanProperty(value);
    }

    private _paginationSimple = false;

    @Output() pageChange = new EventEmitter<number>();
    @Output() pageSizeChange = new EventEmitter<number>();
    @Output() sortChange = new EventEmitter<{
        key: NzSafeAny;
        value: string | null;
    }>();

    @ContentChildren(TableColumnDirective) columns!: QueryList<TableColumnDirective>;

    @Input() selectedDataItems: Dictionary[] = [];
    @Input() bordered = true;

    @Output() selectedDataItemsChange = new EventEmitter<Dictionary[]>();
    allChecked = false;
    checkboxIndeterminate = false;
    allCheckboxDisabled = false;

    @Output() onDataItemSelected = new EventEmitter<any>();
    @Input() indexSelected: number;
    @Output() indexSelectedChange = new EventEmitter<number>();

    $destroy = new Subject<boolean>();
    @Input() frontPagination = false;
    @Input() isMulti = false;
    @Input() isNoPaging = false;
    constructor() {}

    ngOnInit() {}
    onPageNumberChange($event: number) {
        this.indexSelected = undefined;
        this.pageChange.emit($event);
    }

    onPageSizeChange($event: number) {
        this.indexSelected = undefined;
        this.pageSizeChange.emit($event);
    }

    onSort($event: { key: NzSafeAny; value: string | null }) {
        this.indexSelected = undefined;
        this.sortChange.emit($event);
    }

    checkAll(value: boolean): void {
        if (this.isMulti) {
            const listFilter = this.rows.filter(({ disabled }) => !disabled);
            listFilter.forEach((data) => ((<Dictionary>data).checked = this.allChecked));
            this.refreshCheckStatus(listFilter);
        }
    }

    refreshCheckStatus(entityList: Dictionary[], data?: Dictionary): void {
        this.indexSelected = undefined;
        const listFilter = entityList.filter(({ disabled }) => !disabled);
        if (listFilter.length === 0) {
            this.allChecked = false;
            this.checkboxIndeterminate = false;
            this.selectedDataItems = [];
            this.allCheckboxDisabled = true;
        } else {
            this.allCheckboxDisabled = false;
            // Chọn tất cả
            const allChecked = listFilter.every((value) => value.checked === true);
            // bỏ chọn tất cả
            const allUnChecked = listFilter.every((value) => !value.checked);
            this.allChecked = allChecked;
            // Kiểu hộp chọn
            this.checkboxIndeterminate = !allChecked && !allUnChecked;
            // Dữ liệu đã chọn
            if (this.isMulti) {
                this.selectedDataItems = listFilter.filter((value) => value.checked);
            } else {
                entityList.forEach((value) => {
                    if (JSON.stringify(value) !== JSON.stringify(data)) {
                        value.checked = false;
                    }
                });
                if (data) {
                    this.selectedDataItems = [data];
                }
            }
        }

        this.selectedDataItemsChange.emit(this.selectedDataItems);
    }

    onRowClick(data: Dictionary, index: number) {
        this.indexSelected = index;
        this.indexSelectedChange.emit(index);
        this.onDataItemSelected.emit(data);
    }
}
