using static SunnyGardenCoffee.CommonEnum;
using SunnyGardenCoffee.Entities;
using Abp.AutoMapper;
using System.Collections.Generic;

namespace SunnyGardenCoffee.AppCore.Dto
{
    [AutoMap(typeof(CustommerEntity))]
    public class KhachHangDto : CustommerDomain
    {
        public string TimeAgo { get; set; }
        public float TongTien { get; set; }
        public string StrStatus
        {
            get
            {
                return Status.HasValue ? GetEnumDescription((TrangThaiMuaHang)Status) : "";
            }
        }
        public List<CustommerOrderDto> DanhSachOrder { get; set; }
    }

    [AutoMap(typeof(CustommerOrderEntity))]
    public class CustommerOrderDto : CustommerOrderDomain
    {
        public string TenThucDon { get; set; }
    }



}
