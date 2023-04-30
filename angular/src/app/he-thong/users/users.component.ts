import { Component, Injector, OnInit } from "@angular/core";
import { finalize } from "rxjs/operators";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PagedListingComponentBase, PagedRequestDto } from "shared/paged-listing-component-base";
import { UserServiceProxy, UserDto, CreateUserDto } from "@shared/service-proxies/service-proxies";
import { CreateUserDialogComponent } from "./create-user/create-user-dialog.component";
import { EditUserDialogComponent } from "./edit-user/edit-user-dialog.component";
import { ResetPasswordDialogComponent } from "./reset-password/reset-password.component";

@Component({
    templateUrl: "./users.component.html",
    animations: [appModuleAnimation()],
})
export class UsersComponent extends PagedListingComponentBase<UserDto> implements OnInit {
    isActive: boolean | null;

    constructor(injector: Injector, private _userService: UserServiceProxy) {
        super(injector);
    }
    ngOnInit(): void {
        this.refresh();
    }
    createUser(): void {
        this.showCreateOrEditUserDialog();
    }

    editUser(user: UserDto): void {
        this.showCreateOrEditUserDialog(user);
    }

    public resetPassword(user: UserDto): void {
        this.showResetPasswordUserDialog(user.id);
    }

    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        let input = Object.assign({
            ...this.searchDto,
        });
        input.keyword = "";
        input.isActive = this.isActive;

        input.maxResultCount = request.maxResultCount;
        input.skipCount = request.skipCount;
        input.sorting = request.sorting;
        this._userService
            .getAll(input.keyword, input.isActive, request.skipCount, request.maxResultCount)
            .pipe(finalize(finishedCallback))
            .subscribe((result) => {
                this.dataList = result.items;
                this.showPaging(result);
                this.afterGetDataPaging();
            });
    }

    protected delete(user: UserDto): void {
        abp.message.confirm("Bạn có chắc chắn muốn xóa " + user.userName + " ?", undefined, (result: boolean) => {
            if (result) {
                this._userService.delete(user.id).subscribe(() => {
                    abp.notify.success("Xóa thành công!");
                    this.refresh();
                });
            }
        });
    }

    private showResetPasswordUserDialog(id?: number): void {
        let sTitle = "Đặt lại mật khẩu";
        const modal = this.modalService.create({
            nzTitle: sTitle,
            nzContent: ResetPasswordDialogComponent,
            nzComponentParams: {
                id: id,
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

    private showCreateOrEditUserDialog(data?: UserDto): void {
        let sTitle = data?.id > 0 ? "Cập nhật " : "Thêm mới";
        if (data?.id > 0) {
            const modal = this.modalService.create({
                nzTitle: sTitle,
                nzContent: EditUserDialogComponent,
                nzComponentParams: {
                    user: data,
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
                nzContent: CreateUserDialogComponent,
                nzComponentParams: {
                    user: new CreateUserDto(),
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
