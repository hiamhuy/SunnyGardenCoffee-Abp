import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  Injector,
} from "@angular/core";
import { AppComponentBase } from "shared/common/app-component-base";
import { NzModalRef } from "ng-zorro-antd/modal";

@Component({
  selector: "abp-modal-footer",
  templateUrl: "./abp-modal-footer.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AbpModalFooterComponent extends AppComponentBase {
  @Input() cancelLabel = "Hủy";
  @Input() cancelDisabled: boolean;
  @Input() saveLabel = "Lưu";
  @Input() saveDisabled: boolean;

  @Output() onCancelClick = new EventEmitter<number>();

  constructor(injector: Injector) {
    super(injector);
  }

  // close(){
  //   this.nzModalRef.close();
  // }
}
