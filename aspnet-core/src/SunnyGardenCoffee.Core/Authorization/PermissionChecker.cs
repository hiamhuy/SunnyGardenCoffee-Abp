using Abp.Authorization;
using SunnyGardenCoffee.Authorization.Roles;
using SunnyGardenCoffee.Authorization.Users;

namespace SunnyGardenCoffee.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {
        }
    }
}
