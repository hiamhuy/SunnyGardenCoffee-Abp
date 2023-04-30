import { Component, Injector, Input, OnInit } from "@angular/core";
import { ModalComponentBase } from "@shared/common/modal-component-base";
import { BILLTYPE, HoaDonDto, QuanLyDonHangAppServicesServiceProxy } from "@shared/service-proxies/service-proxies";

@Component({
    templateUrl: "./xem-chi-tiet.component.html",
    styleUrls: ["./xem-chi-tiet.component.scss"],
})
export class XemChiTietComponent extends ModalComponentBase implements OnInit {
    @Input() hoaDon: HoaDonDto = new HoaDonDto();
    BILLTYPE = BILLTYPE;
    constructor(injector: Injector, private dataService: QuanLyDonHangAppServicesServiceProxy) {
        super(injector);
    }

    ngOnInit() {
        if (this.hoaDon.id) {
            this.getHoaDonChiTiet(this.hoaDon.id);
        }
    }
    getHoaDonChiTiet(id: number) {
        this.dataService
            .getHoaDonChiTietByHoaDonId(id)
            .pipe()
            .subscribe((result) => {
                if (result) {
                    this.hoaDon.hoaDonChiTietDtos = [];
                    this.hoaDon.hoaDonChiTietDtos = result;
                }
            });
    }
}
