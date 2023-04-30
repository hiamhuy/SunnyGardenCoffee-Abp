import { Component, Injector, OnInit } from "@angular/core";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PagedListingComponentBase, PagedRequestDto } from "@shared/paged-listing-component-base";
import {
    NhanVienAppServicesServiceProxy,
    NhanVienDto,
    NhanVienPagingListRequest,
} from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { CreateOrEditComponent } from "./create-or-edit/create-or-edit.component";

@Component({
    selector: "app-nhan-vien",
    templateUrl: "./nhan-vien.component.html",
    styleUrls: ["./nhan-vien.component.scss"],
    animations: [appModuleAnimation()],
})
export class NhanVienComponent extends PagedListingComponentBase<NhanVienDto> implements OnInit {
    constructor(injector: Injector, private dataService: NhanVienAppServicesServiceProxy) {
        super(injector);
    }

    ngOnInit() {
        this.refresh();
    }

    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        let input = Object.assign(new NhanVienPagingListRequest(), {
            ...this.searchDto,
        });

        input.maxResultCount = request.maxResultCount;
        input.skipCount = request.skipCount;
        input.sorting = request.sorting;
        this.dataService
            .getPageList(input)
            .pipe(finalize(finishedCallback))
            .subscribe((result) => {
                this.dataList = result.items;
                this.showPaging(result);
                this.afterGetDataPaging();
            });
    }

    createOrEdit(data?: NhanVienDto) {
        // let icon =
        //   '<span id="full-screen" class="fas fa-expand full-screen"></span>';
        let sTitle = data?.id > 0 ? "Cập nhật " : "Thêm mới";
        const modal = this.modalService.create({
            nzTitle: sTitle,
            nzContent: CreateOrEditComponent,
            nzComponentParams: {
                dataItem: data || new NhanVienDto(),
            },
            nzFooter: null,
            nzWidth: "40%",
        });

        modal.afterClose.subscribe((result) => {
            if (result != null) {
                this.refresh();
            }
        });
    }

    delete(data: NhanVienDto) {
        this.message.confirm("", "Bạn có chắc chắn muốn xóa bản ghi này?", (isConfirmed) => {
            if (isConfirmed) {
                this.dataService.delete(data.id).subscribe((result) => {
                    this.notify.success("Xóa thành công !");
                    this.refresh();
                });
            }
        });
    }

    multiDelete() {
        this.message.confirm("", "Bạn có chắc chắn muốn xóa những bản ghi đã chọn ?", (isConfirmed) => {
            if (isConfirmed) {
                const ids = this.selectedDataItems.map((m) => m.id);
                this.dataService.deleteMulti(ids).subscribe(() => {
                    this.notify.success("Xóa thành công !");
                    this.refresh();
                });
            }
        });
    }
}
