using System;
using System.Collections.Generic;
using System.Text;
namespace SunnyGardenCoffee
{
    public static partial class CommonEnum
    {
        public enum HostLevel
        {
            [EnumDisplayString("Admin")]
            Admin = 1,
            [EnumDisplayString("Quản lý")]
            QuanLy = 2,
            [EnumDisplayString("Nhân viên")]
            NhanVien = 3,
        }
        public enum Menu
        {
            [EnumDisplayString("Đồ uống")]
            DoUong = 1,
            [EnumDisplayString("Món ăn")]
            MonAn = 2,
          
        }
        public enum BILLTYPE
        {
            [EnumDisplayString("Mua về")]
            MuaVe = 1,
            [EnumDisplayString("Tại quán")]
            TaiQuan = 2,

        }
        public enum TrangThaiMuaHang
        {
            [EnumDisplayString("Đã đặt hàng")]
            DaDat = 1,
            [EnumDisplayString("Đã giao hàng")]
            DaGiaoHang = 2,
            [EnumDisplayString("Từ trối")]
            TuTroi = 3,
        }

    }
}
