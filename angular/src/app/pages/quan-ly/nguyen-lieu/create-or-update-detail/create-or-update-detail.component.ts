import { Component, Injector, Input, OnInit } from "@angular/core";
import { ModalComponentBase } from "@shared/common/modal-component-base";
import { BienLaiNhapChiTietDto } from "@shared/service-proxies/service-proxies";

@Component({
    templateUrl: "./create-or-update-detail.component.html",
    styleUrls: ["./create-or-update-detail.component.scss"],
})
export class BienLaiCreateOrUpdateDetailComponent extends ModalComponentBase implements OnInit {
    @Input() data: BienLaiNhapChiTietDto = new BienLaiNhapChiTietDto();
    @Input() title: string = "";
    titleButton: string = "";
    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit() {}

    save() {
        this.nzModalRef.close(this.data);
    }
}
