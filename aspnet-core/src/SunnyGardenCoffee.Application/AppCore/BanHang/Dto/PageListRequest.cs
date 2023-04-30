using SunnyGardenCoffee.Dto;

namespace SunnyGardenCoffee.AppCore.Dto
{
    public class DanhSachThucDonPagingListRequest : PagedFullInputDto
    {
        public string CategoryCode { get; set; }
        public string ThucDonName { get; set; }
    }

}


