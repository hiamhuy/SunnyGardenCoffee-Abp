using System.Threading.Tasks;
using SunnyGardenCoffee.Configuration.Dto;

namespace SunnyGardenCoffee.Configuration
{
    public interface IConfigurationAppService
    {
        Task ChangeUiTheme(ChangeUiThemeInput input);
    }
}
