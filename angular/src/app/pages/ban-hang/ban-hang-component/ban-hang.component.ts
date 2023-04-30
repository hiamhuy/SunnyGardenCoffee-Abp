import { AfterViewChecked, ChangeDetectorRef, Component, Injector, OnInit } from "@angular/core";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from "@shared/common/app-component-base";
import {
    BanHangAppServicesServiceProxy,
    BILLTYPE,
    DanhSachBanDto,
    DanhSachThucDonDto,
    HoaDonThanhToan,
    Menu,
} from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { HoaDonThanhToanComponent } from "../hoa-don-thanh-toan/hoa-don-thanh-toan.component";
import { TableModalComponent } from "../table-modal/table-modal.component";
class ListTab {
    id: number;
    code: string;
    name: string;
    icon: string;
    isActive: boolean;
}
@Component({
    selector: "app-ban-hang",
    templateUrl: "./ban-hang.component.html",
    styleUrls: ["./ban-hang.component.scss"],
    animations: [appModuleAnimation()],
})
export class BanHangComponent extends AppComponentBase implements OnInit, AfterViewChecked {
    listMenu: any;
    menu = Menu;
    BILLTYPE = BILLTYPE;
    status: number;
    tabIndex: string = "LOAI-68848";
    tableName: string;
    title: string = "Món ăn";
    hoaDon: HoaDonThanhToan = new HoaDonThanhToan();
    constructor(
        injector: Injector,
        private dataService: BanHangAppServicesServiceProxy,
        private cdr: ChangeDetectorRef
    ) {
        super(injector);
    }
    ngAfterViewChecked(): void {
        this.cdr.detectChanges();
    }

    ngOnInit() {
        this.hoaDon.kieuMua = BILLTYPE.MuaVe;
        this.getListLoai();
    }

    getListLoai() {
        this.dataService
            .getListLoai()
            .pipe(finalize(() => abp.ui.clearBusy()))
            .subscribe((result) => {
                if (result) {
                    this.listMenu = result.map((item) => {
                        var itemMenu = new ListTab();
                        itemMenu.id = item.id;
                        itemMenu.code = item.categoryCode;
                        itemMenu.name = item.categoryName;
                        itemMenu.icon = "";
                        itemMenu.isActive = false;
                        return itemMenu;
                    });
                    this.listMenu[0].isActive = true;
                    this.listMenu[0].icon = "fas fa-pizza-slice";
                    this.listMenu[1].icon = "fas fa-coffee";
                }
            });
    }

    selectTab(code: string) {
        this.tabIndex = code;
        this.listMenu.forEach((li) => {
            if (li.code == code) {
                this.title = li.name;
                li.isActive = true;
            } else {
                li.isActive = false;
            }
        });
    }

    getDanhSachThucDon(thucDon) {
        let data = new DanhSachThucDonDto();
        data.id = thucDon.id;
        data.thucDonName = thucDon.thucDonName;
        data.gia = thucDon.gia;
        data.soLuong = 1;

        let check = true;
        if (this.hoaDon.danhSachThucDonDto) {
            this.hoaDon.danhSachThucDonDto.forEach((item) => {
                if (item.id == thucDon.id) {
                    item.soLuong++;
                    check = false;
                }
            });
            if (check) {
                this.hoaDon.danhSachThucDonDto.push(data);
            }
            this.tinhTongTien();
        } else {
            this.hoaDon.danhSachThucDonDto = [];
            this.taoMaHoaDon();
            this.hoaDon.danhSachThucDonDto.push(data);
        }
    }
    amountItem(amount: number, idx: number) {
        if (amount == 0) {
            this.hoaDon.danhSachThucDonDto.splice(idx, 1);
            this.tinhTongTien();
        } else {
            this.hoaDon.danhSachThucDonDto[idx].soLuong = amount;
            this.tinhTongTien();
        }
    }
    tinhTongTien() {
        this.hoaDon.tongTien = 0;
        this.hoaDon.danhSachThucDonDto.forEach((item) => {
            var sum = item.gia * item.soLuong;
            this.hoaDon.tongTien += sum;
        });
    }
    removeThucDon(idx: number) {
        this.hoaDon.danhSachThucDonDto.splice(idx, 1);
        this.tinhTongTien();
    }

    taoMaHoaDon() {
        this.hoaDon.maHoaDon = this.ranDomMa(6);
    }

    ranDomMa(length: any) {
        var text = "SGC-BILL-";
        var possible = "0123456789";

        for (var i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
    chonBan() {
        let sTitle = "Danh sách bàn tại quán";
        const modal = this.modalService.create({
            nzTitle: sTitle,
            nzContent: TableModalComponent,
            nzComponentParams: {},
            nzFooter: null,
            nzWidth: "60%",
        });

        modal.afterClose.subscribe((result: DanhSachBanDto) => {
            if (result != null) {
                this.hoaDon.banId = result.id;
                this.hoaDon.tenBan = result.nameTable;
            }
        });
    }

    thanhToan() {
        let sTitle = "Hóa đơn " + "- " + this.hoaDon.maHoaDon + " -" + " thanh toán";
        const modal = this.modalService.create({
            nzTitle: sTitle,
            nzContent: HoaDonThanhToanComponent,
            nzComponentParams: {
                hoaDon: this.hoaDon,
            },
            nzFooter: null,
            nzWidth: window.innerWidth < 600 ? "60%" : "35%",
        });

        modal.afterClose.subscribe((result) => {
            if (result) {
                this.refresh();
            }
        });
    }

    refresh() {
        this.hoaDon.danhSachThucDonDto = [];
        this.hoaDon = new HoaDonThanhToan();
        this.hoaDon.kieuMua = BILLTYPE.MuaVe;
    }
}
