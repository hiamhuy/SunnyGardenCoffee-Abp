using SunnyGardenCoffee.Debugging;

namespace SunnyGardenCoffee
{
    public class SunnyGardenCoffeeConsts
    {
        public const string LocalizationSourceName = "SunnyGardenCoffee";

        public const string ConnectionStringName = "SunnyGardenDb";

        public const bool MultiTenancyEnabled = true;

        public const string AbpApiClientUserAgent = "AbpApiClient";

        /// <summary>
        /// Default pass phrase for SimpleStringCipher decrypt/encrypt operations
        /// </summary>
        public static readonly string DefaultPassPhrase =
            DebugHelper.IsDebug ? "gsKxGZ012HLL3MI5" : "0399c54ad4334853a138d956dc16cce5";
    }
}
