using Abp.Application.Services;
using SunnyGardenCoffee.MultiTenancy.Dto;

namespace SunnyGardenCoffee.MultiTenancy
{
    public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
    {
    }
}

