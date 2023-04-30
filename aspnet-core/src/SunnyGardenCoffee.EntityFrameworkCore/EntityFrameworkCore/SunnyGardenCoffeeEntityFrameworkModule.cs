using Abp.Dependency;
using Abp.EntityFrameworkCore.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Abp.Zero.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using newPSG.PMS.Configuration;
using newPSG.PMS.EntityFrameworkCore;
using SunnyGardenCoffee.EntityFrameworkCore.Seed;

namespace SunnyGardenCoffee.EntityFrameworkCore
{
    [DependsOn(
        typeof(SunnyGardenCoffeeCoreModule),
        typeof(AbpZeroCoreEntityFrameworkCoreModule))]
    public class SunnyGardenCoffeeEntityFrameworkModule : AbpModule
    {
        /* Used it tests to skip dbcontext registration, in order to use in-memory database of EF Core */
        public bool SkipDbContextRegistration { get; set; }

        public bool SkipDbSeed { get; set; }
        IConfigurationRoot Configurations { get; }

        public override void PreInitialize()
        {
            if (!SkipDbContextRegistration)
            {
                Configuration.Modules.AbpEfCore().AddDbContext<SunnyGardenCoffeeDbContext>(options =>
                {
                    if (options.ExistingConnection != null)
                    {
                        SunnyGardenCoffeeDbContextConfigurer.Configure(options.DbContextOptions, options.ExistingConnection);
                    }
                    else
                    {
                        SunnyGardenCoffeeDbContextConfigurer.Configure(options.DbContextOptions, options.ConnectionString);
                    }
                });
            }

            Configuration.EntityHistory.IsEnabled = false;
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(SunnyGardenCoffeeEntityFrameworkModule).GetAssembly());
        }

        public override void PostInitialize()
        {
            var configurationAccessor = IocManager.Resolve<IAppConfigurationAccessor>();

            using (var scope = IocManager.CreateScope())
            {
                if (!SkipDbSeed && scope.Resolve<DatabaseCheckHelper>().Exist(configurationAccessor.Configuration["ConnectionStrings:SunnyGardenDb"]))
                {
                    SeedHelper.SeedHostDb(IocManager);
                }
            }
            //if (!SkipDbSeed)
            //{
            //    SeedHelper.SeedHostDb(IocManager);
            //}
        }
    }
}
