import { Injectable } from "@angular/core";
import { PermissionCheckerService } from "abp-ng2-module";
import { AppSessionService } from "../session/app-session.service";

import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    CanLoad,
    Route,
    Router,
    RouterStateSnapshot,
    UrlSegment,
    UrlTree,
} from "@angular/router";
import { UrlHelper } from "@shared/helpers/UrlHelper";
import { Observable, of } from "rxjs";

@Injectable()
export class AppRouteGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(
        private _permissionChecker: PermissionCheckerService,
        private _router: Router,
        private _sessionService: AppSessionService
    ) {}

    canActivateInternal(data: any, state: RouterStateSnapshot): Observable<boolean> {
        if (UrlHelper.isInstallUrl(location.href)) {
            return of(true);
        }

        if (!this._sessionService.user) {
            this._router.navigate(["/account/login"]);
            return of(false);
        }

        if (!data || !data["permission"]) {
            return of(true);
        }

        if (this._permissionChecker.isGranted(data["permission"])) {
            return of(true);
        }

        this._router.navigate([this.selectBestRoute()]);
        return of(false);
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.canActivateInternal(route.data, state);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.canActivate(route, state);
    }
    canLoad(
        route: Route,
        segments: UrlSegment[]
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.canActivateInternal(route.data, null);
    }

    selectBestRoute(): string {
        if (!this._sessionService.user) {
            return "/account/login";
        }

        var role = this._sessionService.role;
        var checkRole = role.some((x) => x.userId == this._sessionService.user.id && x.roleId == 4);
        if (checkRole) {
            return "/app/ban-hang";
        }

        if (this._permissionChecker.isGranted("Pages.Users")) {
            return "/app/he-thong";
        }

        return "/app/dashboard-main";
    }
}
