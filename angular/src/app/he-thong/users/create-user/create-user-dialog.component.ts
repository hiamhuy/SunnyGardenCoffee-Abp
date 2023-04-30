import { Component, Injector, OnInit, EventEmitter, Output } from "@angular/core";
import { forEach as _forEach, map as _map } from "lodash-es";
import { UserServiceProxy, CreateUserDto, RoleDto } from "@shared/service-proxies/service-proxies";
import { AbpValidationError } from "@shared/components/validation/abp-validation.api";
import { ModalComponentBase } from "@shared/common/modal-component-base";
import { finalize } from "rxjs/operators";

@Component({
    templateUrl: "./create-user-dialog.component.html",
})
export class CreateUserDialogComponent extends ModalComponentBase implements OnInit {
    formId = "validateCreateUser";
    saving = false;
    user = new CreateUserDto();
    roles: RoleDto[] = [];
    checkedRolesMap: { [key: string]: boolean } = {};
    defaultRoleCheckedStatus = false;
    passwordVisible = false;
    rePasswordVisible = false;
    passwordValidationErrors: Partial<AbpValidationError>[] = [
        {
            name: "pattern",
            localizationKey: "PasswordsMustBeAtLeast8CharactersContainLowercaseUppercaseNumber",
        },
    ];
    confirmPasswordValidationErrors: Partial<AbpValidationError>[] = [
        {
            name: "validateEqual",
            localizationKey: "PasswordsDoNotMatch",
        },
    ];

    @Output() onSave = new EventEmitter<any>();

    constructor(injector: Injector, public _userService: UserServiceProxy) {
        super(injector);
    }

    ngOnInit(): void {
        this.user.isActive = true;

        this._userService.getRoles().subscribe((result) => {
            this.roles = result.items;
            this.setInitialRolesStatus();
        });
    }

    setInitialRolesStatus(): void {
        _map(this.roles, (item) => {
            this.checkedRolesMap[item.normalizedName] = this.isRoleChecked(item.normalizedName);
        });
    }

    isRoleChecked(normalizedName: string): boolean {
        // just return default role checked status
        // it's better to use a setting
        return this.defaultRoleCheckedStatus;
    }

    onRoleChange(role: RoleDto, $event) {
        this.checkedRolesMap[role.normalizedName] = $event;
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
            .create(this.user)
            .pipe(
                finalize(() => {
                    this.saving = false;
                })
            )
            .subscribe((result) => {
                this.notify.success("Thêm thành công !!");
                this.close(result);
            });
    }
}
