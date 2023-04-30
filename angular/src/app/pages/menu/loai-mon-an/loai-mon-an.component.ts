import { Component, Injector, OnInit } from "@angular/core";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PagedListingComponentBase, PagedRequestDto } from "@shared/paged-listing-component-base";
import { LoaiAppServicesServiceProxy, LoaiDto } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { LoaiCreateOrUpdateComponent } from "./loai-create-or-update/loai-create-or-update.component";

@Component({
    selector: "app-loai-mon-an",
    templateUrl: "./loai-mon-an.component.html",
    styleUrls: ["./loai-mon-an.component.scss"],
    animations: [appModuleAnimation()],
})
export class LoaiMonAnComponent extends PagedListingComponentBase<LoaiDto> implements OnInit {
    constructor(injector: Injector, private dataService: LoaiAppServicesServiceProxy) {
        super(injector);
    }

    ngOnInit() {
        this.refresh();
    }

    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        let input = Object.assign({
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
            });
    }

    createOrEdit(data?: LoaiDto) {
        let sTitle = data?.id > 0 ? "Cập nhật " : "Thêm mới";
        const modal = this.modalService.create({
            nzTitle: sTitle,
            nzContent: LoaiCreateOrUpdateComponent,
            nzComponentParams: {
                dataItem: data || new LoaiDto(),
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

    delete(dataItem: LoaiDto): void {
        this.message.confirm("", "Bạn có chắc chắn muốn xóa bản ghi này?", (isConfirmed) => {
            if (isConfirmed) {
                this.dataService.delete(dataItem.id).subscribe(() => {
                    this.notify.success("Xóa thành công !");
                    this.refresh();
                });
            }
        });
    }

    deleteMulti(): void {
        this.message.confirm("", "Bạn có chắc chắn muốn xóa những bản ghi đã chọn ?", (isConfirmed) => {
            if (isConfirmed) {
                const ids = this.selectedDataItems.map((m) => m.id);
                this.crudServiceProxy.deleteMulti(ids).subscribe(() => {
                    this.notify.success("Xóa thành công !");
                    this.refresh();
                });
            }
        });
    }
}
