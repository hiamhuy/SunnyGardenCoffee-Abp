import { Component, Injector, OnInit } from "@angular/core";
import { ModalComponentBase } from "@shared/common/modal-component-base";
import { BanHangAppServicesServiceProxy, DanhSachBanDto } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "app-table-modal",
    templateUrl: "./table-modal.component.html",
    styleUrls: ["./table-modal.component.scss"],
})
export class TableModalComponent extends ModalComponentBase implements OnInit {
    dataList: DanhSachBanDto[] = [];
    constructor(injector: Injector, private dataService: BanHangAppServicesServiceProxy) {
        super(injector);
    }

    ngOnInit() {
        this.getListTables();
    }

    getListTables() {
        this.dataService
            .getListTable()
            .pipe(finalize(() => abp.ui.clearBusy()))
            .subscribe((result) => {
                if (result) {
                    this.dataList = result;
                }
            });
    }

    outPutData(table: DanhSachBanDto) {
        this.nzModalRef.close(table);
    }
}
