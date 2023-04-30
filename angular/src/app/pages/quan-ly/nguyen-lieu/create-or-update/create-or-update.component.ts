import { Component, Injector, Input, OnInit } from "@angular/core";
import { ModalComponentBase } from "@shared/common/modal-component-base";
import {
    BienLaiNhapChiTietDto,
    BienLaiNhapDto,
    NguyenLieuAppServicesServiceProxy,
} from "@shared/service-proxies/service-proxies";
import * as _ from "lodash";
import { finalize } from "rxjs/operators";
import { BienLaiCreateOrUpdateDetailComponent } from "../create-or-update-detail/create-or-update-detail.component";

@Component({
    selector: "app-create-or-update",
    templateUrl: "./create-or-update.component.html",
    styleUrls: ["./create-or-update.component.scss"],
})
export class BienLaiCreateOrUpdateComponent extends ModalComponentBase implements OnInit {
    @Input() dataItem: BienLaiNhapDto = new BienLaiNhapDto();
    titleButton: string = "";
    constructor(injector: Injector, private dataService: NguyenLieuAppServicesServiceProxy) {
        super(injector);
    }

    ngOnInit() {
        if (this.dataItem.id > 0) {
            this.getInfoById(this.dataItem.id);
            this.titleButton = "Chỉnh sửa";
        } else {
            this.dataItem = new BienLaiNhapDto();
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

    create() {
        let sTitle = "Thêm mới";
        const modal = this.modalService.create({
            nzTitle: sTitle,
            nzContent: BienLaiCreateOrUpdateDetailComponent,
            nzComponentParams: {
                data: new BienLaiNhapChiTietDto(),
                title: sTitle,
            },
            nzFooter: null,
            nzWidth: "60%",
        });

        modal.afterClose.subscribe((result) => {
            if (result != null) {
                if (this.dataItem.bienLaiNhapChiTietDtos) {
                    this.dataItem.bienLaiNhapChiTietDtos.push(result);
                } else {
                    this.dataItem.bienLaiNhapChiTietDtos = [];
                    this.dataItem.bienLaiNhapChiTietDtos.push(result);
                }
            }
        });
    }

    update(item: BienLaiNhapChiTietDto, idx: number) {
        let sTitle = "Chỉnh sửa";
        const modal = this.modalService.create({
            nzTitle: sTitle,
            nzContent: BienLaiCreateOrUpdateDetailComponent,
            nzComponentParams: {
                data: item,
                title: sTitle,
            },
            nzFooter: null,
            nzWidth: "60%",
        });

        modal.afterClose.subscribe((result) => {
            if (result != null) {
                if (this.dataItem.bienLaiNhapChiTietDtos) {
                    this.dataItem.bienLaiNhapChiTietDtos[idx] = result;
                } else {
                    this.dataItem.bienLaiNhapChiTietDtos = [];
                    this.dataItem.bienLaiNhapChiTietDtos.push(result);
                }
            }
        });
    }

    delete(item: BienLaiNhapChiTietDto, idx: number) {
        this.dataItem.bienLaiNhapChiTietDtos.splice(idx, 1);
    }
}
