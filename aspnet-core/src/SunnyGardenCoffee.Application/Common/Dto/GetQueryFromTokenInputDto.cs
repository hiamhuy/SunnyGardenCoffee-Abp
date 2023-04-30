using SunnyGardenCoffee.Dto;

namespace SunnyGardenCoffee.Common.Dto
{
    public class GetQueryFromTokenInputDto : PagedFullInputDto
    {
        public string Token { get; set; }
        public object Paramater { get; set; }
    }
}
