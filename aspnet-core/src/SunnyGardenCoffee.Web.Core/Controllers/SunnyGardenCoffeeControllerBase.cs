using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace SunnyGardenCoffee.Controllers
{
    public abstract class SunnyGardenCoffeeControllerBase: AbpController
    {
        protected SunnyGardenCoffeeControllerBase()
        {
            LocalizationSourceName = SunnyGardenCoffeeConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
