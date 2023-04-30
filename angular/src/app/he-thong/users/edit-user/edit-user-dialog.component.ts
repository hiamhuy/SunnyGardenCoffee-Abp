import { Component, Injector, OnInit, EventEmitter, Output } from "@angular/core";
import { forEach as _forEach, includes as _includes, map as _map } from "lodash-es";
import { UserServiceProxy, UserDto, RoleDto } from "@shared/service-proxies/service-proxies";
import { ModalComponentBase } from "@shared/common/modal-component-base";
import { finalize } from "rxjs/operators";

@Component({
    templateUrl: "./edit-user-dialog.component.html",
})
export class EditUserDialogComponent extends ModalComponentBase implements OnInit {
    saving = false;
    user = new UserDto();
    roles: RoleDto[] = [];
    checkedRolesMap: { [key: string]: boolean } = {};
    id: number;

    @Output() onSave = new EventEmitter<any>();

    constructor(injector: Injector, public _userService: UserServiceProxy) {
        super(injector);
    }

    ngOnInit(): void {
        if (this.user.id > 0) {
            this._userService.get(this.user.id).subscribe((result) => {
                this.user = result;

                this._userService.getRoles().subscribe((result2) => {
                    this.roles = result2.items;
                    this.setInitialRolesStatus();
                });
            });
        }
    }

    setInitialRolesStatus(): void {
        _map(this.roles, (item) => {
            this.checkedRolesMap[item.normalizedName] = this.isRoleChecked(item.normalizedName);
        });
    }

    isRoleChecked(normalizedName: string): boolean {
        return _includes(this.user.roleNames, normalizedName);
    }

    onRoleChange(role: RoleDto, $event) {
        this.checkedRolesMap[role.normalizedName] = $event.target.checked;
    }

    getCheckedRoles(): string[] {
        const roles: string[] = [];
        _forEach(this.checkedRolesMap, function (value, key) {
            if (value) {
                roles.push(key);
            }
        });
        return roles;
    }

    save(): void {
        this.saving = true;
        this.user.roleNames = this.getCheckedRoles();

        this._userService
            .update(this.user)
            .pipe(
                finalize(() => {
                    this.saving = false;
                })
            )
            .subscribe((result) => {
                this.notify.success("Sửa thành công !!");
                this.close(result);
            });
    }
}
