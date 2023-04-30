using Abp.Configuration.Startup;
using Abp.Localization.Dictionaries;
using Abp.Localization.Dictionaries.Xml;
using Abp.Reflection.Extensions;

namespace SunnyGardenCoffee.Localization
{
    public static class SunnyGardenCoffeeLocalizationConfigurer
    {
        public static void Configure(ILocalizationConfiguration localizationConfiguration)
        {
            localizationConfiguration.Sources.Add(
                new DictionaryBasedLocalizationSource(SunnyGardenCoffeeConsts.LocalizationSourceName,
                    new XmlEmbeddedFileLocalizationDictionaryProvider(
                        typeof(SunnyGardenCoffeeLocalizationConfigurer).GetAssembly(),
                        "SunnyGardenCoffee.Localization.SourceFiles"
                    )
                )
            );
        }
    }
}
