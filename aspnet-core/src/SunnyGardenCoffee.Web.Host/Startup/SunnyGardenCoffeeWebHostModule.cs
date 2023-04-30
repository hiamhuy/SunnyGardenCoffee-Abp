using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using SunnyGardenCoffee.Configuration;

namespace SunnyGardenCoffee.Web.Host.Startup
{
    [DependsOn(
       typeof(SunnyGardenCoffeeWebCoreModule))]
    public class SunnyGardenCoffeeWebHostModule: AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public SunnyGardenCoffeeWebHostModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(SunnyGardenCoffeeWebHostModule).GetAssembly());
        }
    }
}
