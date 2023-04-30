using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using SunnyGardenCoffee.Authorization;

namespace SunnyGardenCoffee
{
    [DependsOn(
        typeof(SunnyGardenCoffeeCoreModule), 
        typeof(AbpAutoMapperModule))]
    public class SunnyGardenCoffeeApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Authorization.Providers.Add<SunnyGardenCoffeeAuthorizationProvider>();
        }

        public override void Initialize()
        {
            var thisAssembly = typeof(SunnyGardenCoffeeApplicationModule).GetAssembly();

            IocManager.RegisterAssemblyByConvention(thisAssembly);

            Configuration.Modules.AbpAutoMapper().Configurators.Add(
                // Scan the assembly for classes which inherit from AutoMapper.Profile
                cfg => cfg.AddMaps(thisAssembly)
            );
        }
    }
}
