using Abp.AutoMapper;
using SunnyGardenCoffee.Entities;

namespace SunnyGardenCoffee.AppCore.Dto
{

    [AutoMap(typeof(TableEntity))]
    public class BanDto : TableDomain
    {
     
    }


}
