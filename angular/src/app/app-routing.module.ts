import { NgModule } from "@angular/core";
import { Router, RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { AppRouteGuard } from "@shared/auth/auth-route-guard";
const routes: Routes = [
    {
        path: "app",
        component: AppComponent,
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        data: {
            breadcrumb: "Trang chủ",
        },
        children: [
            {
                path: "",
                children: [
                    {
                        path: "",
                        redirectTo: "/app/dashboard-main/dashboard",
                        pathMatch: "full",
                    },
                ],
            },
            {
                path: "dashboard-main",
                loadChildren: () => import("./dashboard-main/main.module").then((m) => m.MainModule), // Lazy load admin module
                data: { preload: true },
            },
            {
                path: "quan-ly",
                loadChildren: () => import("./pages/quan-ly/quan-ly.module").then((m) => m.QuanLyModule), // Lazy load admin module
                data: { preload: true },
                canLoad: [AppRouteGuard],
            },
            {
                path: "menu",
                loadChildren: () => import("./pages/menu/menu.module").then((m) => m.MenuModule), // Lazy load admin module
                data: { preload: true },
                canLoad: [AppRouteGuard],
            },
            {
                path: "he-thong",
                loadChildren: () => import("./he-thong/he-thong.module").then((m) => m.HeThongModule), // Lazy load admin module
                data: { preload: true },
                canLoad: [AppRouteGuard],
            },
            {
                path: "ban-hang",
                loadChildren: () => import("./pages/ban-hang/ban-hang.module").then((m) => m.BanHangModule), // Lazy load admin module
                data: { preload: true },
                canLoad: [AppRouteGuard],
            },

            { path: "**", redirectTo: "/app/dashboard-main/dashboard" },
        ],
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            useHash: false,
            // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
            // Pls refer to https://ng-alain.com/components/reuse-tab
            // scrollPositionRestoration: 'top',
            scrollPositionRestoration: "disabled",
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {
    constructor(private router: Router) {}
}
