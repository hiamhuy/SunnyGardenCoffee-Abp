using System.Collections.Generic;

namespace SunnyGardenCoffee.Authentication.External
{
    public interface IExternalAuthConfiguration
    {
        List<ExternalLoginProviderInfo> Providers { get; }
    }
}
