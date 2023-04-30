import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { LayoutStoreService } from "@shared/layout/layout-store.service";

@Component({
  selector: "header-left-navbar",
  templateUrl: "./header-left-navbar.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderLeftNavbarComponent implements OnInit {
  sidebarExpanded: boolean;
  icon: string = "fas fa-outdent";
  constructor(private _layoutStore: LayoutStoreService) {}

  ngOnInit(): void {
    this._layoutStore.sidebarExpanded.subscribe((value) => {
      this.sidebarExpanded = value;
      // if (!this.sidebarExpanded) {
      //   this.icon = "fas fa-outdent";
      // } else {
      //   this.icon = "fas fa-indent";
      // }
    });
  }

  toggleSidebar(): void {
    this._layoutStore.setSidebarExpanded(!this.sidebarExpanded);
  }
}
