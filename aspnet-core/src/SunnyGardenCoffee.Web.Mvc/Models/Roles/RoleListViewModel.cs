using System.Collections.Generic;
using SunnyGardenCoffee.Roles.Dto;

namespace SunnyGardenCoffee.Web.Models.Roles
{
    public class RoleListViewModel
    {
        public IReadOnlyList<PermissionDto> Permissions { get; set; }
    }
}
