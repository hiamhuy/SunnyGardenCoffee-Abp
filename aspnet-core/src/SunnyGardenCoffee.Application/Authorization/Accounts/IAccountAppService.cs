using System.Threading.Tasks;
using Abp.Application.Services;
using SunnyGardenCoffee.Authorization.Accounts.Dto;

namespace SunnyGardenCoffee.Authorization.Accounts
{
    public interface IAccountAppService : IApplicationService
    {
        Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

        Task<RegisterOutput> Register(RegisterInput input);
    }
}
