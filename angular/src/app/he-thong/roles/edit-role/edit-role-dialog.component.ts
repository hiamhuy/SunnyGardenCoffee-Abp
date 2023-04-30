import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output,
  Input,
} from "@angular/core";
import {
  forEach as _forEach,
  includes as _includes,
  map as _map,
} from "lodash-es";
import {
  RoleServiceProxy,
  GetRoleForEditOutput,
  RoleDto,
  PermissionDto,
  RoleEditDto,
  FlatPermissionDto,
} from "@shared/service-proxies/service-proxies";
import { ModalComponentBase } from "@shared/common/modal-component-base";
import { finalize } from "rxjs/operators";

@Component({
  templateUrl: "edit-role-dialog.component.html",
})
export class EditRoleDialogComponent
  extends ModalComponentBase
  implements OnInit
{
  formId = "validateCreateRole";
  saving = false;
  @Input() roleId: number;
  role = new RoleEditDto();
  permissions: FlatPermissionDto[];
  grantedPermissionNames: string[];
  checkedPermissionsMap: { [key: string]: boolean } = {};

  constructor(injector: Injector, private _roleService: RoleServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
    if (this.roleId > 0) {
      this.getData(this.roleId);
    }
  }
  getData(id: number) {
    this._roleService
      .getRoleForEdit(id)
      .subscribe((result: GetRoleForEditOutput) => {
        this.role = result.role;
        this.permissions = result.permissions;

        this.grantedPermissionNames = result.grantedPermissionNames;
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
    return _includes(this.grantedPermissionNames, permissionName);
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

    const role = new RoleDto();
    role.init(this.role);
    role.grantedPermissions = this.getCheckedPermissions();

    this._roleService
      .update(role)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe((result) => {
        this.notify.success("Sửa thành công !!");
        this.nzModalRef.close(result);
      });
  }
}
