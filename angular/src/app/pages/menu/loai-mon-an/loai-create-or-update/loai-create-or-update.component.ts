import { Component, Injector, Input, OnInit } from "@angular/core";
import { ModalComponentBase } from "@shared/common/modal-component-base";
import { LoaiAppServicesServiceProxy, LoaiDto } from "@shared/service-proxies/service-proxies";
import * as _ from "lodash";
import * as $ from "jquery";
import { finalize } from "rxjs/operators";

@Component({
    templateUrl: "./loai-create-or-update.component.html",
})
export class LoaiCreateOrUpdateComponent extends ModalComponentBase implements OnInit {
    titleButton: string = "";
    @Input() dataItem: LoaiDto = new LoaiDto();

    isMaTuDong: boolean = true;
    constructor(injector: Injector, private dataService: LoaiAppServicesServiceProxy) {
        super(injector);
    }

    ngOnInit() {
        if (this.dataItem.id > 0) {
            this.getInfoById(this.dataItem.id);
            this.titleButton = "Chỉnh sửa";
        } else {
            this.dataItem = new LoaiDto();
            this.titleButton = "Thêm mới";
        }
    }
    getInfoById(id: number) {
        abp.ui.setBusy();
        this.dataService
            .getInfoById(id)
            .pipe(finalize(() => abp.ui.clearBusy()))
            .subscribe((result) => {
                if (result.isSuccessful) {
                    this.dataItem = result.dataResult;
                }
            });
    }

    save() {
        abp.ui.setBusy();
        if (this.isMaTuDong && !this.dataItem.categoryCode) {
            this.dataItem.categoryCode = this.ranDomMa(5);
        }
        var input = _.cloneDeep(this.dataItem);

        this.dataService
            .createOrUpdate(input)
            .pipe(finalize(() => abp.ui.clearBusy()))
            .subscribe((result) => {
                if (result.isSuccessful) {
                    this.notify.success(this.titleButton + " " + "thành công!");
                    this.close(result);
                }
            });
    }

    ranDomMa(length: any) {
        var text = "LOAI-";
        var possible = "0123456789";

        for (var i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
}
