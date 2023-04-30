import { NotificationBellComponent } from "./shared/layout/header/notification-bell/notification-bell.component";
import { HeThongModule } from "./he-thong/he-thong.module";
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientJsonpModule } from "@angular/common/http";
import { HttpClientModule } from "@angular/common/http";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { TabsModule } from "ngx-bootstrap/tabs";
import { NgxPaginationModule } from "ngx-pagination";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ServiceProxyModule } from "@shared/service-proxies/service-proxy.module";
import { SharedModule } from "@shared/shared.module";
import { HeaderComponent } from "./shared/layout/header/header.component";
import { HeaderLeftNavbarComponent } from "./shared/layout/header/header-left-navbar.component";
import { HeaderLanguageMenuComponent } from "./shared/layout/header/header-language-menu.component";
import { HeaderUserMenuComponent } from "./shared/layout/header/header-user-menu.component";
import { FooterComponent } from "./shared/layout/footer/footer.component";
import { SidebarComponent } from "./shared/layout/sidebar/sidebar.component";
import { SidebarLogoComponent } from "./shared/layout/sidebar/sidebar-logo.component";
import { SidebarMenuComponent } from "./shared/layout/sidebar/menu/sidebar-menu.component";
import { LoadingModule } from "@delon/abc/loading";
import { MainModule } from "./dashboard-main/main.module";
import { default as ngLang } from "@angular/common/locales/vi";
import { en_US, NZ_I18N, vi_VN as zorroLang } from "ng-zorro-antd/i18n";
import { BanHangModule } from "./pages/ban-hang/ban-hang.module";
import { CurrencyMaskModule } from "ng2-currency-mask";
import { TextMaskModule } from "angular2-text-mask";
import { NgZorroAntdModule } from "@shared/shared-zorro.module";
import { ChatSignalrService } from "./shared/chat-signalr.service";
import { ChatSignalrPublicService } from "./shared/chat-signalr-public.service";
import { ShowBillComponent } from "./shared/layout/header/notification-bell/show-bill/show-bill.component";
import { ThongTinKhachHangStateService } from "./pages/thong-tin-khach-hang/service/update-state.service";
const LANG = {
    abbr: "vi",
    ng: ngLang,
    zorro: zorroLang,
};

const LANG_PROVIDES = [
    { provide: LOCALE_ID, useValue: LANG.abbr },
    { provide: NZ_I18N, useValue: LANG.zorro },
];

@NgModule({
    declarations: [
        AppComponent,
        // layout
        HeaderComponent,
        HeaderLeftNavbarComponent,
        HeaderLanguageMenuComponent,
        HeaderUserMenuComponent,
        FooterComponent,
        SidebarComponent,
        SidebarLogoComponent,
        SidebarMenuComponent,
        NotificationBellComponent,
        ShowBillComponent,
    ],
    exports: [],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        CollapseModule,
        TabsModule,
        AppRoutingModule,
        ServiceProxyModule,
        SharedModule,
        NgxPaginationModule,
        LoadingModule,
        HeThongModule,
        MainModule,
        BanHangModule,
        CurrencyMaskModule,
        TextMaskModule,
        NgZorroAntdModule,
    ],
    providers: [
        ChatSignalrService,
        ChatSignalrPublicService,
        ThongTinKhachHangStateService,
        ...LANG_PROVIDES,
        { provide: NZ_I18N, useValue: en_US },
        { provide: DEFAULT_CURRENCY_CODE, useValue: "VND" },
    ],
    entryComponents: [],
})
export class AppModule {}
