using Abp.AutoMapper;
using SunnyGardenCoffee.Entities;

namespace SunnyGardenCoffee.AppCore.Dto
{

    [AutoMap(typeof(CategoryEntity))]
    public class LoaiDto : CategoryDomain
    {
     
    }


}
