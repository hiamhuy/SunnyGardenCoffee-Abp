import { Component, ChangeDetectionStrategy, Injector } from "@angular/core";
import { AppComponentBase } from "shared/common/app-component-base";
import { AppAuthService } from "@shared/auth/app-auth.service";

@Component({
    selector: "header-user-menu",
    templateUrl: "./header-user-menu.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderUserMenuComponent extends AppComponentBase {
    shownLoginName = "Xin chào, ";

    constructor(injector: Injector, private _authService: AppAuthService) {
        super(injector);
    }
    ngOnInit() {
        this.shownLoginName += this.appSession.user.surname + " " + this.appSession.user.name + " .";
    }
    logout(): void {
        this._authService.logout();
    }
}
