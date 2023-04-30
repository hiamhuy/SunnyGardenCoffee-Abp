using Abp.AutoMapper;
using SunnyGardenCoffee.Entities;
using System.Collections.Generic;

namespace SunnyGardenCoffee.AppCore.Dto
{
    [AutoMap(typeof(ReceiptEntity))]
    public class BienLaiNhapDto: ReceiptDomain
    {
        public int? SoLuong { get; set; }
        public float TongGia { get; set; }
        public List<BienLaiNhapChiTietDto> BienLaiNhapChiTietDtos { get; set; }
    }

    [AutoMap(typeof(ReceiptDetailEntity))]
    public class BienLaiNhapChiTietDto : ReceiptDetailDomain
    {

    }

}
