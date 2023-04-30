import { Component, OnInit, Injector, Input } from "@angular/core";
import { AppComponentBase } from "shared/common/app-component-base";
import { ModalComponentBase } from "@shared/common/modal-component-base";
import { UserServiceProxy, ResetPasswordDto } from "@shared/service-proxies/service-proxies";

@Component({
    selector: "app-reset-password",
    templateUrl: "./reset-password.component.html",
})
export class ResetPasswordDialogComponent extends ModalComponentBase implements OnInit {
    public isLoading = false;
    public resetPasswordDto: ResetPasswordDto;
    @Input() id: number;

    constructor(injector: Injector, private _userService: UserServiceProxy) {
        super(injector);
    }

    ngOnInit() {
        this.isLoading = true;
        this.resetPasswordDto = new ResetPasswordDto();
        this.resetPasswordDto.userId = this.id;
        this.resetPasswordDto.newPassword = Math.random().toString(36).substr(2, 10);
        this.isLoading = false;
    }

    public resetPassword(): void {
        this.isLoading = true;
        this._userService.resetPassword(this.resetPasswordDto).subscribe(
            (result) => {
                this.notify.info("Password Reset");
                this.nzModalRef.close(result);
            },
            () => {
                this.isLoading = false;
            }
        );
    }
}
