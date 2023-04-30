using Abp.AspNetCore.Mvc.Views;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Mvc.Razor.Internal;

namespace SunnyGardenCoffee.Web.Views
{
    public abstract class SunnyGardenCoffeeRazorPage<TModel> : AbpRazorPage<TModel>
    {
        [RazorInject]
        public IAbpSession AbpSession { get; set; }

        protected SunnyGardenCoffeeRazorPage()
        {
            LocalizationSourceName = SunnyGardenCoffeeConsts.LocalizationSourceName;
        }
    }
}
