import { Component, Injector, Input, OnInit } from "@angular/core";
import { ModalComponentBase } from "@shared/common/modal-component-base";
import {
    KhachHangDto,
    ThongBaoAppServicesServiceProxy,
    TrangThaiMuaHang,
} from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    templateUrl: "./show-bill.component.html",
    styleUrls: ["./show-bill.component.scss"],
})
export class ShowBillComponent extends ModalComponentBase implements OnInit {
    @Input() data: KhachHangDto = new KhachHangDto();
    TrangThaiMuaHang = TrangThaiMuaHang;
    @Input() isView: boolean = false;
    constructor(injector: Injector, private dataService: ThongBaoAppServicesServiceProxy) {
        super(injector);
    }

    ngOnInit() {
        if (this.data.id > 0) {
            this.getOrderByKhachHang(this.data.id);
        }
    }

    getOrderByKhachHang(id: number) {
        this.dataService
            .getDanhSachOrder(id)
            .pipe(
                finalize(() => {
                    abp.ui.clearBusy();
                })
            )
            .subscribe((result) => {
                if (result) {
                    this.data = result;
                }
            });
    }

    xacNhan() {
        this.dataService
            .xacNhan(this.data.id)
            .pipe(
                finalize(() => {
                    abp.ui.clearBusy();
                })
            )
            .subscribe((result) => {
                if (result) {
                    this.close(result);
                    this.notify.success("Đã chấp nhận đơn hàng.");
                }
            });
    }

    tuTroi() {
        this.dataService
            .tuTroi(this.data.id)
            .pipe(
                finalize(() => {
                    abp.ui.clearBusy();
                })
            )
            .subscribe((result) => {
                if (result) {
                    this.close(result);
                    this.notify.info("Bạn đã hủy đơn hàng này.");
                }
            });
    }
}
