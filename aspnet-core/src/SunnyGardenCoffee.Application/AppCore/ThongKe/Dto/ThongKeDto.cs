using Abp.AutoMapper;
using SunnyGardenCoffee.Entities;
using System;
using System.Collections.Generic;

namespace SunnyGardenCoffee.AppCore.Dto
{
    public class ThongKeDto
    {
        public int? SoDonHang { get; set; }
        public float? DongTienRa { get; set; }
        public float? DongTienVao { get; set; }
        public float? LoiNhuan { get; set; }

        public List<ThucDonHot> danhSachHot { get; set; }
    }

    public class BieuDoThongKeDto
    {
        public string ThangNam { get; set; }
        public float TienRa { get; set; }
        public float TienVao { get; set; }
    }

    public class DoUongBanChay
    {
        public long? Id { get; set; }
        public int? Count { get; set; }
      
    }
    public class ThucDonHot
    {
        public long? Id { get; set; }
        public string HinhAnh { get; set; }
        public string TenMon { get; set; }
    }
}
