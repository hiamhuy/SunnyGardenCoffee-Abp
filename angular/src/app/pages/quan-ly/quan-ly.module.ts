import { NguyenLieuComponent } from "./nguyen-lieu/nguyen-lieu.component";
import { DoanhThuComponent } from "./doanh-thu/doanh-thu.component";
import { DonHangComponent } from "./don-hang/don-hang.component";
import { NhanVienComponent } from "./nhan-vien/nhan-vien.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientJsonpModule } from "@angular/common/http";
import { HttpClientModule } from "@angular/common/http";
import { ModalModule } from "ngx-bootstrap/modal";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { TabsModule } from "ngx-bootstrap/tabs";
import { NgxPaginationModule } from "ngx-pagination";
import { QuanLyRoutingModule } from "./quan-ly-routing.module";
import { SharedModule } from "@shared/shared.module";
import { CustomizeCompModule } from "@app/shared/customize-comp/customize-comp.module";
import { ThongTinKhachHangComponent } from "@app/pages/thong-tin-khach-hang/thong-tin-khach-hang.component";
import { CreateOrEditComponent } from "@app/pages/quan-ly/nhan-vien/create-or-edit/create-or-edit.component";
import { DataCompModule } from "@app/shared/data-comp/data-comp.module";
import { DanhSachBanComponent } from "./danh-sach-ban/danh-sach-ban.component";
import { CreateOrUpdateBanComponent } from "./danh-sach-ban/create-or-update-ban/create-or-update-ban.component";
import { XemChiTietComponent } from "./don-hang/xem-chi-tiet/xem-chi-tiet.component";
import { BienLaiCreateOrUpdateComponent } from "./nguyen-lieu/create-or-update/create-or-update.component";
import { BienLaiCreateOrUpdateDetailComponent } from "./nguyen-lieu/create-or-update-detail/create-or-update-detail.component";

var nhanVien = [NhanVienComponent, CreateOrEditComponent];
var donHang = [DonHangComponent, XemChiTietComponent];
var doanhThu = [DoanhThuComponent];
var nguyenLieu = [NguyenLieuComponent, BienLaiCreateOrUpdateComponent, BienLaiCreateOrUpdateDetailComponent];
var thongTinKhachHang = [ThongTinKhachHangComponent];
var danhSachBan = [DanhSachBanComponent, CreateOrUpdateBanComponent];

@NgModule({
    declarations: [...nhanVien, ...donHang, ...doanhThu, ...nguyenLieu, ...thongTinKhachHang, ...danhSachBan],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        ModalModule.forChild(),
        BsDropdownModule,
        CollapseModule,
        TabsModule,
        SharedModule,
        DataCompModule,
        QuanLyRoutingModule,
        CustomizeCompModule,
        NgxPaginationModule,
    ],
    providers: [],
})
export class QuanLyModule {}
