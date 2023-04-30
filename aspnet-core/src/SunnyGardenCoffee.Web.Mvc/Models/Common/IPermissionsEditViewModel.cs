using System.Collections.Generic;
using SunnyGardenCoffee.Roles.Dto;

namespace SunnyGardenCoffee.Web.Models.Common
{
    public interface IPermissionsEditViewModel
    {
        List<FlatPermissionDto> Permissions { get; set; }
    }
}