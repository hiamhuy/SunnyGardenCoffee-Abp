using Abp.Application.Services.Dto;

namespace SunnyGardenCoffee.Roles.Dto
{
    public class PagedRoleResultRequestDto : PagedResultRequestDto
    {
        public string Keyword { get; set; }
    }
}

