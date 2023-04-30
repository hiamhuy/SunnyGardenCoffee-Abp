using Abp.MultiTenancy;
using SunnyGardenCoffee.Authorization.Users;

namespace SunnyGardenCoffee.MultiTenancy
{
    public class Tenant : AbpTenant<User>
    {
        public Tenant()
        {            
        }

        public Tenant(string tenancyName, string name)
            : base(tenancyName, name)
        {
        }
    }
}
