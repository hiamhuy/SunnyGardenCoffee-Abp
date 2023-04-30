using System.Collections.Generic;
using SunnyGardenCoffee.Roles.Dto;

namespace SunnyGardenCoffee.Web.Models.Users
{
    public class UserListViewModel
    {
        public IReadOnlyList<RoleDto> Roles { get; set; }
    }
}
