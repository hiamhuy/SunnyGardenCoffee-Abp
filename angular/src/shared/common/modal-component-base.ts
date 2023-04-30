import { AfterViewInit, Directive, Injector, Input } from "@angular/core";
import { NzModalRef } from "ng-zorro-antd/modal";
import "jqueryui";
import * as $ from "jquery";
import { AppComponentBase } from "shared/common/app-component-base";

@Directive()
export abstract class ModalComponentBase extends AppComponentBase implements AfterViewInit {
    @Input() isFromControl: boolean = false;
    title = "";
    nzLabel = 8;
    nzForm = 16;
    nzModalRef: NzModalRef;
    isContinue = false;
    isView = false;

    constructor(injector: Injector) {
        super(injector);
        this.nzModalRef = injector.get(NzModalRef);
    }

    success(result: any = true) {
        if (result) {
            if (this.isFromControl) {
                const res = this.returnResultForControl(result);
                this.nzModalRef.close(res);
            } else {
                this.nzModalRef.close(result);
            }
        } else {
            this.close();
        }
    }
    returnResultForControl(item: any) {
        return Object.assign({
            ...item,
        });
    }
    close(event?: any): void {
        this.nzModalRef.close(event);
    }

    fullScreenClick() {
        let idEle = ".full-screen";
        var iCheck = true;
        $(idEle).click(function () {
            if (iCheck) {
                $(".ng-trigger-modalContainer").addClass("ant-hidden");
                $(".ant-modal").addClass("ant-modal-full");
            } else {
                $(".ng-trigger-modalContainer").removeClass("ant-hidden");
                $(".ant-modal").removeClass("ant-modal-full");
            }

            iCheck = !iCheck;
        });
    }

    dropDrapModal() {
        let modalContent: any = $(".ant-modal-content");
        modalContent.draggable({
            handle: ".ant-modal-header",
        });
    }

    ngAfterViewInit(): void {
        this.dropDrapModal();
        this.fullScreenClick();
    }
}
