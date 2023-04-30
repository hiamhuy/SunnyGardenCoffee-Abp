using System;
using System.Collections.Generic;

namespace SunnyGardenCoffee.AppCore.Dto
{

    public class DanhSachBanDto
    {
        public long? Id { get; set; }
        public string NameTable { get; set; }
    }

    public class DanhSachLoaiDto
    {
        public long? Id { get; set; }
        public string CategoryCode { get; set; }
        public string CategoryName { get; set; }
    }
    public class DanhSachThucDonDto
    {
        public long? Id { get; set; }
        public string ThucDonName { get; set; }
        public string HinhAnh { get; set;}
        public int? SoLuong { get; set; }
        public float Gia { get; set;}
    }
    public class HoaDonThanhToan
    {
        public string MaHoaDon { get; set; }
        public DateTime? ThoiGianBan { get; set; } 
        public List<DanhSachThucDonDto> DanhSachThucDonDto { get; set; }
        public int? KieuMua { get; set; }
        public string TenBan { get; set; }
        public long? BanId { get; set; }
        public float TongTien { get; set; }
        public int ChietKhau { get; set; }
        public float TongTienThuc { get; set; }
        public float TienKhachDua { get; set; }
        public float TienTraLai { get; set; }
        
    }

    public class HoaDonThanhToanKhachNgoai
    {
        public string SoDienThoai { get; set; }
        public string DiaChiNhanHang { get; set; }
        public List<DanhSachThucDonDto> DanhSachThucDonDto { get; set; }
        public int? SoLuong { get; set; }
        public float? TongTien { get; set; }
    }

}
