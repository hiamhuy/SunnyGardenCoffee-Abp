import { Component, Injector, Input, OnInit } from "@angular/core";
import { ModalComponentBase } from "@shared/common/modal-component-base";
import { ComboBoxTableCode, ThucDonAppServicesServiceProxy, ThucDonDto } from "@shared/service-proxies/service-proxies";
import * as _ from "lodash";
import { finalize } from "rxjs/operators";

@Component({
    templateUrl: "./thuc-don-create-or-edit.component.html",
    styleUrls: ["./thuc-don-create-or-edit.component.scss"],
})
export class ThucDonCreateOrEditComponent extends ModalComponentBase implements OnInit {
    @Input() dataItem: ThucDonDto = new ThucDonDto();
    titleButton: string = "";
    isMaTuDong: boolean = true;
    ComboBoxTableCode = ComboBoxTableCode;

    constructor(injector: Injector, private dataService: ThucDonAppServicesServiceProxy) {
        super(injector);
    }

    ngOnInit() {
        if (this.dataItem.id > 0) {
            this.getInfoById(this.dataItem.id);
            this.titleButton = "Chỉnh sửa";
        } else {
            this.dataItem = new ThucDonDto();
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
        if (this.isMaTuDong && !this.dataItem.codeMerchandise) {
            this.dataItem.codeMerchandise = this.ranDomMa(5);
        }
        var input = _.cloneDeep(this.dataItem);
        abp.ui.setBusy();
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

    getCategoryCode(event) {
        if (event) {
            this.dataItem.categoryCode = event.data.categoryCode;
        }
    }

    ranDomMa(length: any) {
        var text = "TDMN-";
        var possible = "0123456789";

        for (var i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
}
