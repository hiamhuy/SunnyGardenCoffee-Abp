using Abp.Localization;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Abp.Runtime.Security;
using Abp.Timing;
using Abp.Zero;
using Abp.Zero.Configuration;
using SunnyGardenCoffee.Authorization.Roles;
using SunnyGardenCoffee.Authorization.Users;
using SunnyGardenCoffee.Configuration;
using SunnyGardenCoffee.Localization;
using SunnyGardenCoffee.MultiTenancy;
using SunnyGardenCoffee.Timing;

namespace SunnyGardenCoffee
{
    [DependsOn(typeof(AbpZeroCoreModule))]
    public class SunnyGardenCoffeeCoreModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Auditing.IsEnabledForAnonymousUsers = true;

            // Declare entity types
            Configuration.Modules.Zero().EntityTypes.Tenant = typeof(Tenant);
            Configuration.Modules.Zero().EntityTypes.Role = typeof(Role);
            Configuration.Modules.Zero().EntityTypes.User = typeof(User);

            SunnyGardenCoffeeLocalizationConfigurer.Configure(Configuration.Localization);

            // Enable this line to create a multi-tenant application.
            Configuration.MultiTenancy.IsEnabled = SunnyGardenCoffeeConsts.MultiTenancyEnabled;

            // Configure roles
            AppRoleConfig.Configure(Configuration.Modules.Zero().RoleManagement);

            Configuration.Settings.Providers.Add<AppSettingProvider>();

            Configuration.Localization.Languages.Add(new LanguageInfo("en", "English", "famfamfam-flags us"));

            Configuration.Settings.SettingEncryptionConfiguration.DefaultPassPhrase = SunnyGardenCoffeeConsts.DefaultPassPhrase;
            SimpleStringCipher.DefaultPassPhrase = SunnyGardenCoffeeConsts.DefaultPassPhrase;
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(SunnyGardenCoffeeCoreModule).GetAssembly());
        }

        public override void PostInitialize()
        {
            IocManager.Resolve<AppTimes>().StartupTime = Clock.Now;
        }
    }
}
