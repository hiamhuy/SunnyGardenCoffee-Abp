import { AfterViewChecked, ChangeDetectorRef, Component, Injector, Input, OnInit } from "@angular/core";
import { ModalComponentBase } from "@shared/common/modal-component-base";
import { BanHangAppServicesServiceProxy, BILLTYPE, HoaDonThanhToan } from "@shared/service-proxies/service-proxies";
import * as _ from "lodash";
import { finalize } from "rxjs/operators";
import { DateTime } from "luxon";

@Component({
    templateUrl: "./hoa-don-thanh-toan.component.html",
    styleUrls: ["./hoa-don-thanh-toan.component.scss"],
})
export class HoaDonThanhToanComponent extends ModalComponentBase implements OnInit, AfterViewChecked {
    @Input() hoaDon: HoaDonThanhToan = new HoaDonThanhToan();
    isDisabled: boolean = true;
    BILLTYPE = BILLTYPE;
    constructor(
        injector: Injector,
        private cdr: ChangeDetectorRef,
        private dataService: BanHangAppServicesServiceProxy
    ) {
        super(injector);
    }
    ngAfterViewChecked(): void {
        this.cdr.detectChanges();
    }

    ngOnInit() {
        this.hoaDon.chietKhau = 0;
        this.hoaDon.tienTraLai = 0;
        this.hoaDon.thoiGianBan = new DateTime.now();
        this.tinhTongTienThuc();
    }

    tinhTienThuc(event) {
        this.hoaDon.chietKhau = event;
        this.tinhTongTienThuc();
    }
    tinhTongTienThuc() {
        this.hoaDon.tongTienThuc = 0;
        if (this.hoaDon.chietKhau > 0) {
            this.hoaDon.tongTienThuc = this.hoaDon.tongTien - (this.hoaDon.tongTien * this.hoaDon.chietKhau) / 100;
        } else {
            this.hoaDon.tongTienThuc = this.hoaDon.tongTien;
        }
    }

    tinhTienThua(event) {
        this.hoaDon.tienKhachDua = event;
        this.hoaDon.tienTraLai = 0;
        if (this.hoaDon.tienKhachDua > 0) {
            this.hoaDon.tienTraLai = this.hoaDon.tienKhachDua - this.hoaDon.tongTienThuc;
        }

        if (this.hoaDon.tienTraLai < 0) {
            this.isDisabled = true;
        } else if (this.hoaDon.tienKhachDua == 0 && this.hoaDon.tienKhachDua == null) {
            this.isDisabled = true;
        } else {
            this.isDisabled = false;
        }
    }
    thanhToan() {
        let input = _.cloneDeep(this.hoaDon);
        this.dataService
            .thanhToan(input)
            .pipe(finalize(() => abp.ui.clearBusy()))
            .subscribe((result) => {
                if (result) {
                    this.notify.success("Thanh toán thành công !");
                    this.nzModalRef.close(result);
                }
            });
    }
}
