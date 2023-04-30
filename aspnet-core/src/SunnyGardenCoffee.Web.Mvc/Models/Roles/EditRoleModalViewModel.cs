using Abp.AutoMapper;
using SunnyGardenCoffee.Roles.Dto;
using SunnyGardenCoffee.Web.Models.Common;

namespace SunnyGardenCoffee.Web.Models.Roles
{
    [AutoMapFrom(typeof(GetRoleForEditOutput))]
    public class EditRoleModalViewModel : GetRoleForEditOutput, IPermissionsEditViewModel
    {
        public bool HasPermission(FlatPermissionDto permission)
        {
            return GrantedPermissionNames.Contains(permission.Name);
        }
    }
}
