import { Component, Injector, Input, OnInit } from "@angular/core";
import { ModalComponentBase } from "@shared/common/modal-component-base";
import { BanAppServicesServiceProxy, BanDto } from "@shared/service-proxies/service-proxies";
import * as _ from "lodash";
import { finalize } from "rxjs/operators";

@Component({
    selector: "app-create-or-update-ban",
    templateUrl: "./create-or-update-ban.component.html",
})
export class CreateOrUpdateBanComponent extends ModalComponentBase implements OnInit {
    @Input() dataItem: BanDto = new BanDto();
    titleButton: string = "";
    isMaTuDong: boolean = true;
    constructor(injector: Injector, private dataService: BanAppServicesServiceProxy) {
        super(injector);
    }

    ngOnInit() {
        if (this.dataItem.id > 0) {
            this.getInfoById(this.dataItem.id);
            this.titleButton = "Chỉnh sửa";
        } else {
            this.dataItem = new BanDto();
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
        if (this.isMaTuDong && !this.dataItem.codeTable) {
            this.dataItem.codeTable = this.ranDomMa(5);
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
        var text = "BAN-";
        var possible = "0123456789";

        for (var i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
}
