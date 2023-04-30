using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using SunnyGardenCoffee.Configuration;

namespace SunnyGardenCoffee.Web.Startup
{
    [DependsOn(typeof(SunnyGardenCoffeeWebCoreModule))]
    public class SunnyGardenCoffeeWebMvcModule : AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public SunnyGardenCoffeeWebMvcModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(SunnyGardenCoffeeWebMvcModule).GetAssembly());
        }
    }
}
