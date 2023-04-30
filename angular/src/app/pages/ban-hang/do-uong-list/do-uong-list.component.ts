import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import {
    BanHangAppServicesServiceProxy,
    DanhSachThucDonDto,
    DanhSachThucDonPagingListRequest,
} from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "do-uong-list",
    templateUrl: "./do-uong-list.component.html",
    styleUrls: ["./do-uong-list.component.scss"],
})
export class DoUongListComponent extends AppComponentBase implements OnInit, OnChanges {
    @Input() categoryCode: string;
    @Input() title: string;
    @Output() thucDonOutput: EventEmitter<any> = new EventEmitter();
    searchDto: any = {};
    listThucDon: DanhSachThucDonDto[] = [];
    duongDanAnh: string = this.serviceImageUrl + "/";
    constructor(injector: Injector, private dataService: BanHangAppServicesServiceProxy) {
        super(injector);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            this.title = changes.title.currentValue;
            this.categoryCode = changes.categoryCode.currentValue;
            this.getListThucDon(this.categoryCode);
        }
    }

    ngOnInit() {}

    getListThucDon(categoryCode: string) {
        let input: DanhSachThucDonPagingListRequest = new DanhSachThucDonPagingListRequest();
        input.categoryCode = categoryCode;
        let req = {
            ...input,
            ...this.searchDto,
        };
        this.dataService
            .getListThucDon(req)
            .pipe(finalize(() => abp.ui.clearBusy()))
            .subscribe((result) => {
                if (result) {
                    this.listThucDon = result;
                }
            });
    }
}
