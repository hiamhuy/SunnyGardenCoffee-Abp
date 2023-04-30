using Abp.AutoMapper;
using SunnyGardenCoffee.Entities;
using System.Collections.Generic;
using static SunnyGardenCoffee.CommonEnum;

namespace SunnyGardenCoffee.AppCore.Dto
{

    [AutoMap(typeof(BillEntity))]
    public class HoaDonDto : BillDomain
    {
       
        public string KieuMua
        {
            get
            {
                return Type.HasValue ? GetEnumDescription((BILLTYPE)Type) : "";
            }
        }
        public string TenBan { get; set; }
        public string NguoiBan { get; set; }
        public List<HoaDonChiTietDto> HoaDonChiTietDtos { get; set; }
    }

    [AutoMap(typeof(BillDetailEntity))]
    public class HoaDonChiTietDto : BillDetailDomain
    {
        public string TenThucDon { get; set; }
    }


}
