import { Component, Injector, OnInit } from "@angular/core";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PagedListingComponentBase, PagedRequestDto } from "@shared/paged-listing-component-base";
import { ThucDonAppServicesServiceProxy, ThucDonDto } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { ThucDonCreateOrEditComponent } from "../thuc-don-create-or-edit/thuc-don-create-or-edit.component";

@Component({
    selector: "app-thuc-don",
    templateUrl: "./thuc-don.component.html",
    styleUrls: ["./thuc-don.component.scss"],
    animations: [appModuleAnimation()],
})
export class ThucDonComponent extends PagedListingComponentBase<ThucDonDto> implements OnInit {
    duongDanAnh: string = this.serviceImageUrl + "/";
    constructor(injector: Injector, private dataService: ThucDonAppServicesServiceProxy) {
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

    createOrEdit(data?: ThucDonDto) {
        let sTitle = data?.id > 0 ? "Cập nhật " : "Thêm mới";
        const modal = this.modalService.create({
            nzTitle: sTitle,
            nzContent: ThucDonCreateOrEditComponent,
            nzComponentParams: {
                dataItem: data || new ThucDonDto(),
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
    delete(dataItem: ThucDonDto): void {
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
