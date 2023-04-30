using Abp.AutoMapper;
using SunnyGardenCoffee.Entities;

namespace SunnyGardenCoffee.AppCore.Dto
{

    [AutoMap(typeof(MerchandiseEntity))]
    public class ThucDonDto : MerchandiseDomain
    {
        public string TenLoai { get; set; }
        public long? CategoryId { get; set; }
    }


}
