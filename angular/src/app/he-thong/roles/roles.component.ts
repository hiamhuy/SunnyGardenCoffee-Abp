import { Component, Injector } from "@angular/core";
import { finalize } from "rxjs/operators";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from "@shared/paged-listing-component-base";
import {
  RoleServiceProxy,
  RoleDto,
} from "@shared/service-proxies/service-proxies";
import { CreateRoleDialogComponent } from "./create-role/create-role-dialog.component";
import { EditRoleDialogComponent } from "./edit-role/edit-role-dialog.component";

@Component({
  templateUrl: "./roles.component.html",
  animations: [appModuleAnimation()],
})
export class RolesComponent extends PagedListingComponentBase<RoleDto> {
  constructor(injector: Injector, private _rolesService: RoleServiceProxy) {
    super(injector);
  }

  protected fetchDataList(
    request: PagedRequestDto,
    pageNumber: number,
    finishedCallback: () => void
  ): void {
    let input = Object.assign({
      ...this.searchDto,
    });
    input.keyword = "";

    input.maxResultCount = request.maxResultCount;
    input.skipCount = request.skipCount;
    // input.sorting = request.sorting;
    this._rolesService
      .getAll(input.keyword, input.skipCount, input.maxResultCount)
      .pipe(finalize(finishedCallback))
      .subscribe((result) => {
        this.dataList = result.items;
        this.showPaging(result);
        this.afterGetDataPaging();
      });
  }

  delete(role: RoleDto): void {
    abp.message.confirm(
      "Bạn có chắc chắn muốn xóa " + role.displayName + "?",
      undefined,
      (result: boolean) => {
        if (result) {
          this._rolesService
            .delete(role.id)
            .pipe(
              finalize(() => {
                abp.notify.success("Xóa thành công !!");
                this.refresh();
              })
            )
            .subscribe(() => {});
        }
      }
    );
  }

  showCreateOrEditRoleDialog(data?: RoleDto) {
    // let icon =
    //   '<span id="full-screen" class="fas fa-expand full-screen"><i nz-icon nzType="fullscreen" nzTheme="outline"></i></span>';

    let sTitle = data?.id > 0 ? "Cập nhật " : "Thêm mới";
    if (data?.id > 0) {
      const modal = this.modalService.create({
        nzTitle: sTitle,
        nzContent: EditRoleDialogComponent,
        nzComponentParams: {
          roleId: data.id,
        },
        nzFooter: null,
        nzWidth: "40%",
      });

      modal.afterClose.subscribe((result) => {
        if (result != null) {
          this.refresh();
        }
      });
    } else {
      const modal = this.modalService.create({
        nzTitle: sTitle,
        nzContent: CreateRoleDialogComponent,
        nzComponentParams: {
          role: new RoleDto(),
        },
        nzFooter: null,
        nzWidth: "40%",
      });

      modal.afterClose.subscribe((result) => {
        if (result != null) {
          this.refresh();
        }
      });
    }
  }
}
