import { Component, Injector, OnInit } from "@angular/core";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PagedListingComponentBase, PagedRequestDto } from "@shared/paged-listing-component-base";
import {
    HoaDonDto,
    HoaDonPagingListRequest,
    QuanLyDonHangAppServicesServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { XemChiTietComponent } from "./xem-chi-tiet/xem-chi-tiet.component";

@Component({
    selector: "app-don-hang",
    templateUrl: "./don-hang.component.html",
    styleUrls: ["./don-hang.component.scss"],
    animations: [appModuleAnimation()],
})
export class DonHangComponent extends PagedListingComponentBase<HoaDonDto> implements OnInit {
    constructor(injector: Injector, private dataService: QuanLyDonHangAppServicesServiceProxy) {
        super(injector);
    }

    ngOnInit() {
        this.refresh();
    }

    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        let input = Object.assign(new HoaDonPagingListRequest(), {
            ...this.searchDto,
        });

        input.maxResultCount = request.maxResultCount;
        input.skipCount = request.skipCount;
        input.sorting = request.sorting;
        this.dataService
            .getListHoaDon(input)
            .pipe(finalize(finishedCallback))
            .subscribe((result) => {
                this.dataList = result.items;
                this.showPaging(result);
                this.afterGetDataPaging();
            });
    }

    showDetail(data: HoaDonDto) {
        let sTitle = "Hóa đơn " + ": " + data.billCode;
        const modal = this.modalService.create({
            nzTitle: sTitle,
            nzContent: XemChiTietComponent,
            nzComponentParams: {
                hoaDon: data,
            },
            nzFooter: null,
            nzWidth: window.innerWidth < 600 ? "60%" : "35%",
        });

        modal.afterClose.subscribe((result) => {
            if (result) {
            }
        });
    }
}
