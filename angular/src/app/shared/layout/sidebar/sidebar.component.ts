import {
  Component,
  ChangeDetectionStrategy,
  Renderer2,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { LayoutStoreService } from "@shared/layout/layout-store.service";
import { MenuItem } from "@shared/layout/menu-item";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  sidebarExpanded: boolean;
  isCheckRouterBanHang: boolean;

  constructor(
    private renderer: Renderer2,
    private _layoutStore: LayoutStoreService
  ) {}

  ngOnInit(): void {
    if (window.innerWidth < 992) {
    } else if (window.innerWidth < 1200) {
    } else {
    }
    this._layoutStore.sidebarExpanded.subscribe((value) => {
      this.sidebarExpanded = value;
      this.toggleSidebar();
    });
  }

  routerClick(event: MenuItem) {
    if (event) {
      if (event.permissionName == "Pages.BanHang") {
        this.removerSidebarMini();
      } else {
        this.renderer.addClass(document.body, "sidebar-mini");
        this.renderer.addClass(document.body, "sidebar-open");
      }
    }
  }

  toggleSidebar(): void {
    if (this.sidebarExpanded) {
      this.hideSidebar();
    } else {
      this.showSidebar();
    }
  }

  removerSidebarMini() {
    this.renderer.removeClass(document.body, "sidebar-mini");
    this.renderer.removeClass(document.body, "sidebar-open");
    this.renderer.removeClass(document.body, "sidebar-collapse");
    this._layoutStore.setSidebarExpanded(!this.sidebarExpanded);
  }

  showSidebar(): void {
    this.renderer.removeClass(document.body, "sidebar-collapse");
    this.renderer.addClass(document.body, "sidebar-open");
    // this.renderer.removeClass(document.body, "sidebar-mini");
  }

  hideSidebar(): void {
    this.renderer.removeClass(document.body, "sidebar-open");
    this.renderer.addClass(document.body, "sidebar-collapse");
  }

  setWidthColumnSearch(): number {
    if (window.innerWidth < 992) {
      return 24;
    } else if (window.innerWidth < 1200) {
      return 24;
    } else {
      return 18;
    }
  }
}
