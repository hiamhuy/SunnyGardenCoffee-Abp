import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AbpHttpInterceptor, RefreshTokenService } from "abp-ng2-module";
import * as ApiServiceProxies from "./service-proxies";

@NgModule({
    providers: [
        ApiServiceProxies.RoleServiceProxy,
        ApiServiceProxies.SessionServiceProxy,
        ApiServiceProxies.TenantServiceProxy,
        ApiServiceProxies.UserServiceProxy,
        ApiServiceProxies.TokenAuthServiceProxy,
        ApiServiceProxies.AccountServiceProxy,
        ApiServiceProxies.ConfigurationServiceProxy,
        ApiServiceProxies.NhanVienAppServicesServiceProxy,
        ApiServiceProxies.CommonServiceProxy,
        ApiServiceProxies.LoaiAppServicesServiceProxy,
        ApiServiceProxies.ThucDonAppServicesServiceProxy,
        ApiServiceProxies.BanAppServicesServiceProxy,
        ApiServiceProxies.UploadFilesImageServiceProxy,
        ApiServiceProxies.BanHangAppServicesServiceProxy,
        ApiServiceProxies.QuanLyDonHangAppServicesServiceProxy,
        ApiServiceProxies.NguyenLieuAppServicesServiceProxy,
        ApiServiceProxies.ThongBaoAppServicesServiceProxy,
        ApiServiceProxies.KhachHangAppServicesServiceProxy,
        ApiServiceProxies.ThongKeAppServicesServiceProxy,
        { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true },
    ],
})
export class ServiceProxyModule {}
