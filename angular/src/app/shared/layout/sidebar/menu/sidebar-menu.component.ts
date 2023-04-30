import { Component, EventEmitter, Injector, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { AppComponentBase } from "shared/common/app-component-base";
import { Router, RouterEvent, NavigationEnd, PRIMARY_OUTLET } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { filter } from "rxjs/operators";
import { MenuItem } from "@shared/layout/menu-item";

@Component({
    selector: "sidebar-menu",
    templateUrl: "./sidebar-menu.component.html",
    styleUrls: ["../sidebar.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class SidebarMenuComponent extends AppComponentBase implements OnInit {
    menuItems: MenuItem[];
    menuItemsMap: { [key: number]: MenuItem } = {};
    activatedMenuItems: MenuItem[] = [];
    routerEvents: BehaviorSubject<RouterEvent> = new BehaviorSubject(undefined);
    homeRoute = "/app/dashboard-main/dashboard";
    @Output() emitRouter = new EventEmitter();

    constructor(injector: Injector, private router: Router) {
        super(injector);
        this.router.events.subscribe(this.routerEvents);
    }

    ngOnInit(): void {
        this.menuItems = this.getMenuItems();
        this.patchMenuItems(this.menuItems);
        this.routerEvents.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
            const currentUrl = event.url !== "/" ? event.url : this.homeRoute;
            const primaryUrlSegmentGroup = this.router.parseUrl(currentUrl).root.children[PRIMARY_OUTLET];
            if (primaryUrlSegmentGroup) {
                this.activateMenuItems("/" + primaryUrlSegmentGroup.toString());
            }
        });
    }

    getMenuItems(): MenuItem[] {
        return [
            new MenuItem(this.l("Pages_BanHang"), "/app/ban-hang", "fas fa-store", "Pages.BanHang", []),
            new MenuItem(
                this.l("Pages_ThongTinKhachHang"),
                "/app/quan-ly/thong-tin-khach-hang",
                "fas fa-id-card-alt",
                "Pages.ThongTinKhachHang",
                []
            ),
            new MenuItem(
                this.l("Pages_QuanLy_NhanVien"),
                "/app/quan-ly/nhan-vien",
                "fas fa-users",
                "Pages.QuanLy.NhanVien",
                []
            ),
            new MenuItem(
                this.l("Pages_QuanLy_NguyenLieu"),
                "/app/quan-ly/nguyen-lieu",
                "fas fa-truck-loading",
                "Pages.QuanLy.NguyenLieu",
                []
            ),
            new MenuItem(
                this.l("Pages_DanhSachBan"),
                "/app/quan-ly/danh-sach-ban",
                "fas fa-drum-steelpan",
                "Pages.DanhSachBan",
                []
            ),
            new MenuItem(this.l("Pages_Menu"), "", "fas fa-clipboard-list", "Pages.Menu", [
                new MenuItem(this.l("Pages_LoaiMonAn"), "/app/menu/loai", "fas fa-mug-hot", "Pages.LoaiMonAn"),
                new MenuItem(this.l("Pages_ThucDon"), "/app/menu/thuc-don", "fas fa-pizza-slice", "Pages.ThucDon"),
            ]),
            new MenuItem(
                this.l("Pages_QuanLy_DoanhThu"),
                "/app/quan-ly/doanh-thu",
                "fas fa-poll",
                "Pages.QuanLy.DoanhThu",
                []
            ),
            new MenuItem(
                this.l("Pages_QuanLy_DonHang"),
                "/app/quan-ly/don-hang",
                "fas fa-file-invoice-dollar",
                "Pages.QuanLy.DonHang",
                []
            ),

            new MenuItem(this.l("Pages_HeThong"), "", "far fa-sun", "Pages.HeThong", [
                new MenuItem(this.l("Pages_HeThong_Roles"), "/app/he-thong/roles", "fas fa-user-cog", "Pages.Roles"),
                new MenuItem(this.l("Pages_HeThong_User"), "/app/he-thong/users", "far fa-user", "Pages.Users"),
                // new MenuItem(this.l('Tenants'),'/app/he-thong/tenants', 'fas fa-building','Pages.Tenants'),
            ]),
        ];
    }

    patchMenuItems(items: MenuItem[], parentId?: number): void {
        items.forEach((item: MenuItem, index: number) => {
            item.id = parentId ? Number(parentId + "" + (index + 1)) : index + 1;
            if (parentId) {
                item.parentId = parentId;
            }
            if (parentId || item.children) {
                this.menuItemsMap[item.id] = item;
            }
            if (item.children) {
                this.patchMenuItems(item.children, item.id);
            }
        });
    }

    activateMenuItems(url: string): void {
        this.deactivateMenuItems(this.menuItems);
        this.activatedMenuItems = [];
        const foundedItems = this.findMenuItemsByUrl(url, this.menuItems);
        foundedItems.forEach((item) => {
            this.activateMenuItem(item);
        });
    }

    deactivateMenuItems(items: MenuItem[]): void {
        items.forEach((item: MenuItem) => {
            item.isActive = false;
            item.isCollapsed = true;
            if (item.children) {
                this.deactivateMenuItems(item.children);
            }
        });
    }

    findMenuItemsByUrl(url: string, items: MenuItem[], foundedItems: MenuItem[] = []): MenuItem[] {
        items.forEach((item: MenuItem) => {
            if (item.route === url) {
                foundedItems.push(item);
            } else if (item.children) {
                this.findMenuItemsByUrl(url, item.children, foundedItems);
            }
        });
        return foundedItems;
    }

    activateMenuItem(item: MenuItem): void {
        item.isActive = true;
        if (item.children) {
            item.isCollapsed = false;
        }
        this.activatedMenuItems.push(item);
        if (item.parentId) {
            this.activateMenuItem(this.menuItemsMap[item.parentId]);
        }
        this.emitRouter.emit(item);
    }

    isMenuItemVisible(item: MenuItem): boolean {
        if (!item.permissionName) {
            return true;
        }
        return this.permission.isGranted(item.permissionName);
    }
}
