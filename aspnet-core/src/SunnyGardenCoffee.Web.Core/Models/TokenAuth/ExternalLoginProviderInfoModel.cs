using Abp.AutoMapper;
using SunnyGardenCoffee.Authentication.External;

namespace SunnyGardenCoffee.Models.TokenAuth
{
    [AutoMapFrom(typeof(ExternalLoginProviderInfo))]
    public class ExternalLoginProviderInfoModel
    {
        public string Name { get; set; }

        public string ClientId { get; set; }
    }
}
