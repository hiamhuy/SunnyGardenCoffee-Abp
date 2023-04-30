import { AppComponentBase } from "shared/common/app-component-base";
import { Component, Injector, OnInit } from "@angular/core";
import { AppConsts } from "./AppConsts";
import { NzSafeAny } from "ng-zorro-antd/core/types";
import { finalize } from "rxjs/operators";

export class PagedResultDto {
    items: any[];
    totalCount: number;
}

export class EntityDto {
    id: number;
}

export class PagedRequestDto {
    skipCount: number;
    maxResultCount: number;
    sorting: string;
}

@Component({
    template: "",
})
export abstract class PagedListingComponentBase<TEntityDto> extends AppComponentBase implements OnInit {
    public pageNumber = 1;
    public totalPages = 1;
    public totalItems: number;
    public isTableLoading = false;
    public pageSize = AppConsts.grid.defaultPageSize;

    public skipCount: number; //
    public allChecked = false;
    public allCheckboxDisabled = false;
    public checkboxIndeterminate = false;
    public selectedDataItems: EntityDto[] = [];
    public sorting: string = undefined;
    searchDto: any = {};
    // filterColumns: IFilterColumns[];
    dataList: EntityDto[] = [];
    crudServiceProxy: NzSafeAny;
    public booleanFilterList: any[] = [
        { text: this.l("All"), value: "All" },
        { text: this.l("Yes"), value: true },
        { text: this.l("No"), value: false },
    ];

    isView = false;
    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.getDataPage(this.pageNumber);
    }

    clear() {
        this.searchDto = {};
        this.refresh();
    }

    public showPaging(result: PagedResultDto): void {
        this.totalItems = result.totalCount;
    }

    public getDataPage(page: number): void {
        const req = new PagedRequestDto();
        req.maxResultCount = this.pageSize;
        req.skipCount = (page - 1) * this.pageSize;

        this.isTableLoading = true;
        this.fetchDataList(req, page, () => {
            this.isTableLoading = false;
        });
    }
    refreshAllCheckBoxDisabled(): void {
        this.allCheckboxDisabled = this.dataList.length <= 0;
    }

    public pageNumberChange(): void {
        if (this.pageNumber > 0) {
            this.restCheckStatus(this.dataList);
            this.getDataPage(this.pageNumber);
        }
    }

    checkAll(value: boolean): void {
        this.dataList.forEach((data) => ((<any>data).checked = this.allChecked));
        this.refreshCheckStatus(this.dataList);
    }

    refreshCheckStatus(entityList: any[]): void {
        // Chọn tất cả
        const allChecked = entityList.every((value) => value.checked === true);
        // bỏ chọn tất cả
        const allUnChecked = entityList.every((value) => !value.checked);
        this.allChecked = allChecked;
        // Kiểu hộp chọn
        this.checkboxIndeterminate = !allChecked && !allUnChecked;
        // Dữ liệu đã chọn
        this.selectedDataItems = entityList.filter((value) => value.checked);
    }

    restCheckStatus(entityList: any[]): void {
        this.allChecked = false;
        this.checkboxIndeterminate = false;
        // Dữ liệu đã chọn
        this.selectedDataItems = [];
        entityList.forEach((value) => (value.checked = false));
    }
    gridSort(sort: { key: string; value: string }) {
        this.sorting = undefined;
        let ascOrDesc = sort.value; // 'ascend' or 'descend' or null
        const filedName = sort.key;
        if (ascOrDesc) {
            ascOrDesc = abp.utils.replaceAll(ascOrDesc, "end", "");
            const args = ["{0} {1}", filedName, ascOrDesc];
            const sortingStr = abp.utils.formatString.apply(this, args);
            this.sorting = sortingStr;
        }
        this.refresh();
    }

    isGrantedAny(...permissions: string[]): boolean {
        if (!permissions) {
            return false;
        }
        for (const permission of permissions) {
            if (this.isGranted(permission)) {
                return true;
            }
        }
        return false;
    }

    setWidthColumnSearch(): number {
        if (window.innerWidth < 992) {
            return 24;
        } else if (window.innerWidth < 1200) {
            return 24;
        } else {
            return 18;
        }
    }

    // protected abstract list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void;
    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        let input = Object.assign({
            ...this.searchDto,
        });

        input.maxResultCount = request.maxResultCount;
        input.skipCount = request.skipCount;
        input.sorting = request.sorting;
        this.crudServiceProxy
            .getPagingList(input)
            .pipe(finalize(finishedCallback))
            .subscribe((result) => {
                this.dataList = result.items;
                this.showPaging(result);
                this.afterGetDataPaging();
            });
    }

    afterGetDataPaging() {}
    // protected abstract delete(entity: TEntityDto): void;
    protected delete(dataItem: EntityDto): void {
        this.message.confirm("", "Bạn có chắc chắn muốn xóa bản ghi này?", (isConfirmed) => {
            if (isConfirmed) {
                this.crudServiceProxy.delete(dataItem["id"]).subscribe(() => {
                    this.refresh();
                    this.notify.success(this.l("SuccessfullyDeleted"));
                });
            }
        });
    }

    deleteMulti(): void {
        this.message.confirm("", "Bạn có chắc chắn muốn xóa những bản ghi đã chọn ?", (isConfirmed) => {
            if (isConfirmed) {
                const ids = this.selectedDataItems.map((m) => m["id"]);
                this.crudServiceProxy.deleteMulti(ids).subscribe(() => {
                    this.refresh();
                    this.notify.success(this.l("SuccessfullyDeleted"));
                });
            }
        });
    }
}
