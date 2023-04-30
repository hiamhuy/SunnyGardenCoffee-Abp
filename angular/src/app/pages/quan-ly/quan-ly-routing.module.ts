import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ThongTinKhachHangComponent } from "../thong-tin-khach-hang/thong-tin-khach-hang.component";
import { DanhSachBanComponent } from "./danh-sach-ban/danh-sach-ban.component";
import { DoanhThuComponent } from "./doanh-thu/doanh-thu.component";
import { DonHangComponent } from "./don-hang/don-hang.component";
import { NguyenLieuComponent } from "./nguyen-lieu/nguyen-lieu.component";
import { NhanVienComponent } from "./nhan-vien/nhan-vien.component";
const routes: Routes = [
  {
    path: "nhan-vien",
    component: NhanVienComponent,
    data: { permission: "Pages.QuanLy.NhanVien" },
  },
  {
    path: "doanh-thu",
    component: DoanhThuComponent,
    data: { permission: "Pages.QuanLy.DoanhThu" },
  },
  {
    path: "don-hang",
    component: DonHangComponent,
    data: { permission: "Pages.QuanLy.DonHang" },
  },
  {
    path: "nguyen-lieu",
    component: NguyenLieuComponent,
    data: { permission: "Pages.QuanLy.NguyenLieu" },
  },
  {
    path: "thong-tin-khach-hang",
    component: ThongTinKhachHangComponent,
    data: { permission: "Pages.ThongTinKhachHang" },
  },
  {
    path: "danh-sach-ban",
    component: DanhSachBanComponent,
    data: { permission: "Pages.DanhSachBan" },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyRoutingModule {}
