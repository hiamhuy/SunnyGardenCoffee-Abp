using SunnyGardenCoffee.Dto;
using System;

namespace SunnyGardenCoffee.AppCore.Dto
{
    public class HoaDonPagingListRequest : PagedFullInputDto
    {
        public DateTime? TuNgay { get; set; }
        public DateTime? DenNgay { get; set; }
        public int? KieuMua { get; set; }
    }

}


