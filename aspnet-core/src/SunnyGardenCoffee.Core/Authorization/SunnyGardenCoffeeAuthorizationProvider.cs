using Abp.Authorization;
using Abp.Localization;
using Abp.MultiTenancy;

namespace SunnyGardenCoffee.Authorization
{
    public class SunnyGardenCoffeeAuthorizationProvider : AuthorizationProvider
    {
        public override void SetPermissions(IPermissionDefinitionContext context)
        {
            //context.CreatePermission(PermissionNames.Pages_Users, L("Users"));
            context.CreatePermission(PermissionNames.Pages_Users_Activation, L("UsersActivation"));
            context.CreatePermission(PermissionNames.Pages_Roles, L("Roles"));
            context.CreatePermission(PermissionNames.Pages_Users, L("Users"));
            context.CreatePermission(PermissionNames.Pages_Users_ChangPassword, L("Pages_Users_ChangPassword"));
            context.CreatePermission(PermissionNames.Pages_Tenants, L("Tenants"), multiTenancySides: MultiTenancySides.Host);

            var pages = context.GetPermissionOrNull(PermissionNames.Pages) ?? context.CreatePermission(PermissionNames.Pages, L("Pages"));



            var he_thong = pages.CreateChildPermission(PermissionNames.Pages_HeThong, L("Pages_HeThong"));
            pages.CreateChildPermission(PermissionNames.Pages_QuanLy_DonHang, L("Pages_QuanLy_DonHang"));
            pages.CreateChildPermission(PermissionNames.Pages_QuanLy_NguyenLieu, L("Pages_QuanLy_NguyenLieu"));
            pages.CreateChildPermission(PermissionNames.Pages_QuanLy_DoanhThu, L("Pages_QuanLy_DoanhThu"));
            pages.CreateChildPermission(PermissionNames.Pages_QuanLy_NhanVien, L("Pages_QuanLy_NhanVien"));

            pages.CreateChildPermission(PermissionNames.Pages_BanHang, L("Pages_BanHang"));
            pages.CreateChildPermission(PermissionNames.Pages_DashBoard, L("Pages_DashBoard"));
            pages.CreateChildPermission(PermissionNames.Pages_ThongTinKhachHang, L("Pages_ThongTinKhachHang"));
            pages.CreateChildPermission(PermissionNames.Pages_Menu, L("Pages_Menu"));
            pages.CreateChildPermission(PermissionNames.Pages_LoaiMonAn, L("Pages_LoaiMonAn"));
            pages.CreateChildPermission(PermissionNames.Pages_ThucDon, L("Pages_ThucDon"));
            pages.CreateChildPermission(PermissionNames.Pages_DanhSachBan, L("Pages_DanhSachBan"));
        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, SunnyGardenCoffeeConsts.LocalizationSourceName);
        }
    }
}
