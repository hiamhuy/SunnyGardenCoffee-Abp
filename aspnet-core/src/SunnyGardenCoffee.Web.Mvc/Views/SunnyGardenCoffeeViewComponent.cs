using Abp.AspNetCore.Mvc.ViewComponents;

namespace SunnyGardenCoffee.Web.Views
{
    public abstract class SunnyGardenCoffeeViewComponent : AbpViewComponent
    {
        protected SunnyGardenCoffeeViewComponent()
        {
            LocalizationSourceName = SunnyGardenCoffeeConsts.LocalizationSourceName;
        }
    }
}
