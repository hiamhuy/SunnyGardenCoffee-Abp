import { Component, Injector, OnInit, Renderer2 } from "@angular/core";
import { AppComponentBase } from "shared/common/app-component-base";
import { SignalRHelper } from "@shared/helpers/SignalRAspNetCoreHelper";
import { LayoutStoreService } from "@shared/layout/layout-store.service";
import { LoadingService } from "@delon/abc/loading";
import { Subscription } from "rxjs";
import { ChatSignalrService } from "./shared/chat-signalr.service";

@Component({
    selector: "app-app-main",
    templateUrl: "./app.component.html",
})
export class AppComponent extends AppComponentBase implements OnInit {
    sidebarExpanded: boolean;
    private notify$: Subscription;
    constructor(
        injector: Injector,
        private renderer: Renderer2,
        private _layoutStore: LayoutStoreService,
        private loadingSrv: LoadingService,
        private _chatSignalrService: ChatSignalrService
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.renderer.addClass(document.body, "sidebar-mini");

        if (this.appSession.application) {
            SignalRHelper.initSignalR(() => {
                this._chatSignalrService.init();
            });
        }

        abp.event.on("abp.notifications.received", (userNotification) => {
            abp.notifications.showUiNotifyForUserNotification(userNotification);

            // Desktop notification
            Push.create("AbpZeroTemplate", {
                body: userNotification.notification.data.message,
                icon: abp.appPath + "assets/app-logo-small.png",
                timeout: 6000,
                onClick: function () {
                    window.focus();
                    this.close();
                },
            });
        });
        this.registerEvents();
        this._layoutStore.sidebarExpanded.subscribe((value) => {
            this.sidebarExpanded = value;
        });
    }

    toggleSidebar(): void {
        this._layoutStore.setSidebarExpanded(!this.sidebarExpanded);
    }

    registerEvents() {
        abp.event.on("abp.ui.setBusy", (message = "Vui lòng đợi trong giây lát ...") => {
            this.loadingSrv.open({ type: "spin", text: message });
        });
        abp.event.on("abp.ui.clearBusy", () => {
            this.loadingSrv.close();
        });
    }
    ngOnDestroy() {
        this.notify$.unsubscribe();
    }
}
