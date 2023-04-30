using System.Threading.Tasks;
using Abp.Application.Services;
using SunnyGardenCoffee.Sessions.Dto;

namespace SunnyGardenCoffee.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
    }
}
