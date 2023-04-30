import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output,
  Input,
} from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import {
  RoleServiceProxy,
  RoleDto,
  PermissionDto,
  CreateRoleDto,
  GetRoleForEditOutput,
  PermissionDtoListResultDto,
} from "@shared/service-proxies/service-proxies";
import { forEach as _forEach, map as _map } from "lodash-es";
import { ModalComponentBase } from "@shared/common/modal-component-base";
import { NotifyService } from "abp-ng2-module";
import { finalize } from "rxjs/operators";

@Component({
  templateUrl: "create-role-dialog.component.html",
})
export class CreateRoleDialogComponent
  extends ModalComponentBase
  implements OnInit
{
  formId = "validateCreateRole";
  saving = false;
  @Input() role = new RoleDto();
  permissions: PermissionDto[] = [];
  checkedPermissionsMap: { [key: string]: boolean } = {};
  defaultPermissionCheckedStatus = true;

  constructor(
    injector: Injector,
    private _roleService: RoleServiceProxy,
    private _notify: NotifyService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._roleService
      .getAllPermissions()
      .subscribe((result: PermissionDtoListResultDto) => {
        this.permissions = result.items;
        this.setInitialPermissionsStatus();
      });
  }

  setInitialPermissionsStatus(): void {
    _map(this.permissions, (item) => {
      this.checkedPermissionsMap[item.name] = this.isPermissionChecked(
        item.name
      );
    });
  }

  isPermissionChecked(permissionName: string): boolean {
    // just return default permission checked status
    // it's better to use a setting
    return this.defaultPermissionCheckedStatus;
  }

  onPermissionChange(permission: PermissionDto, $event) {
    this.checkedPermissionsMap[permission.name] = $event;
  }

  getCheckedPermissions(): string[] {
    const permissions: string[] = [];
    _forEach(this.checkedPermissionsMap, function (value, key) {
      if (value) {
        permissions.push(key);
      }
    });
    return permissions;
  }

  save(): void {
    this.saving = true;

    const role = new CreateRoleDto();
    role.init(this.role);
    role.grantedPermissions = this.getCheckedPermissions();

    this._roleService
      .create(role)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe((result) => {
        this._notify.success("Thêm thành công !!");
        this.close(result);
      });
  }
}
