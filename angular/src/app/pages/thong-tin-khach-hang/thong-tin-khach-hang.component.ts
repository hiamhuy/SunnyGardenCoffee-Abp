import { Component, Injector, OnInit } from "@angular/core";
import { ShowBillComponent } from "@app/shared/layout/header/notification-bell/show-bill/show-bill.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PagedListingComponentBase, PagedRequestDto } from "@shared/paged-listing-component-base";
import {
    KhachHangAppServicesServiceProxy,
    KhachHangDto,
    KhachHangPagingListRequest,
    TrangThaiMuaHang,
} from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { ThongTinKhachHangStateService } from "./service/update-state.service";

@Component({
    selector: "thong-tin-khach-hang",
    templateUrl: "./thong-tin-khach-hang.component.html",
    styleUrls: ["./thong-tin-khach-hang.component.scss"],
    animations: [appModuleAnimation()],
})
export class ThongTinKhachHangComponent extends PagedListingComponentBase<KhachHangDto> implements OnInit {
    TrangThaiMuaHang = TrangThaiMuaHang;
    constructor(
        injector: Injector,
        private dataService: KhachHangAppServicesServiceProxy,
        private services: ThongTinKhachHangStateService
    ) {
        super(injector);
    }

    ngOnInit() {
        this.refresh();
    }
    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        let input = Object.assign(new KhachHangPagingListRequest(), {
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

    showDetail(data: KhachHangDto) {
        let sTitle = "Đơn hàng " + data.phoneNumber;
        const modal = this.modalService.create({
            nzTitle: sTitle,
            nzContent: ShowBillComponent,
            nzComponentParams: {
                data: data,
                isView: true,
            },
            nzFooter: null,
            nzWidth: "40%",
        });

        modal.afterClose.subscribe((result) => {
            if (result) {
            }
        });
    }

    xuLyDonHang(data: KhachHangDto) {
        let sTitle = "Đơn hàng " + data.phoneNumber;
        const modal = this.modalService.create({
            nzTitle: sTitle,
            nzContent: ShowBillComponent,
            nzComponentParams: {
                data: data,
                isView: false,
            },
            nzFooter: null,
            nzWidth: "40%",
        });

        modal.afterClose.subscribe((result) => {
            if (result) {
                this.refresh();
                this.services.setIsReloadStatus(true);
            }
        });
    }
}
