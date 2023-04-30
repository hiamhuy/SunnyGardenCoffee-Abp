import { Component, Injector, OnInit } from "@angular/core";
import { ModalComponentBase } from "@shared/common/modal-component-base";
import {
    ComboBoxEnumCode,
    NhanVienAppServicesServiceProxy,
    NhanVienDto,
    RoleDto,
    TRANG_THAI,
} from "@shared/service-proxies/service-proxies";
import * as _ from "lodash";
import * as moment from "moment";
import { finalize } from "rxjs/operators";

@Component({
    selector: "app-create-or-edit",
    templateUrl: "./create-or-edit.component.html",
    styleUrls: ["./create-or-edit.component.scss"],
})
export class CreateOrEditComponent extends ModalComponentBase implements OnInit {
    dataItem: NhanVienDto = new NhanVienDto();
    TRANG_THAI = TRANG_THAI;
    ComboBoxEnumCode = ComboBoxEnumCode;
    titleButton: string = "";
    constructor(injector: Injector, private dataService: NhanVienAppServicesServiceProxy) {
        super(injector);
    }

    ngOnInit() {
        if (this.dataItem.id > 0) {
            this.getInfoById(this.dataItem.id);
            this.titleButton = "Chỉnh sửa";
        } else {
            this.dataItem = new NhanVienDto();
            this.dataItem.status = TRANG_THAI.DangHoatDong;
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
    getNumber($event) {
        if ($event) {
            this.dataItem.phoneNumber = $event;
        }
    }
    changePosition(event: RoleDto) {
        if (event && event != null) {
            this.dataItem.positionId = event.id;
        }
    }
    save() {
        abp.ui.setBusy();
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
}
