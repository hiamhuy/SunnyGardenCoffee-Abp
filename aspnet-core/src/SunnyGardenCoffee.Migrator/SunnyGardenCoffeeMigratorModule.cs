using Microsoft.Extensions.Configuration;
using Castle.MicroKernel.Registration;
using Abp.Events.Bus;
using Abp.Modules;
using Abp.Reflection.Extensions;
using SunnyGardenCoffee.Configuration;
using SunnyGardenCoffee.EntityFrameworkCore;
using SunnyGardenCoffee.Migrator.DependencyInjection;

namespace SunnyGardenCoffee.Migrator
{
    [DependsOn(typeof(SunnyGardenCoffeeEntityFrameworkModule))]
    public class SunnyGardenCoffeeMigratorModule : AbpModule
    {
        private readonly IConfigurationRoot _appConfiguration;

        public SunnyGardenCoffeeMigratorModule(SunnyGardenCoffeeEntityFrameworkModule abpProjectNameEntityFrameworkModule)
        {
            abpProjectNameEntityFrameworkModule.SkipDbSeed = true;

            _appConfiguration = AppConfigurations.Get(
                typeof(SunnyGardenCoffeeMigratorModule).GetAssembly().GetDirectoryPathOrNull()
            );
        }

        public override void PreInitialize()
        {
            Configuration.DefaultNameOrConnectionString = _appConfiguration.GetConnectionString(
                SunnyGardenCoffeeConsts.ConnectionStringName
            );

            Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
            Configuration.ReplaceService(
                typeof(IEventBus), 
                () => IocManager.IocContainer.Register(
                    Component.For<IEventBus>().Instance(NullEventBus.Instance)
                )
            );
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(SunnyGardenCoffeeMigratorModule).GetAssembly());
            ServiceCollectionRegistrar.Register(IocManager);
        }
    }
}
