import {
  Component,
  Input,
  Injector,
  Renderer2,
  ElementRef,
  OnInit,
} from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { AppComponentBase } from "shared/common/app-component-base";
import { AbpValidationError } from "./abp-validation.api";

@Component({
  selector: "abp-validation-summary",
  templateUrl: "./abp-validation.summary.component.html",
})
export class AbpValidationSummaryComponent
  extends AppComponentBase
  implements OnInit
{
  defaultValidationErrors: Partial<AbpValidationError>[] = [
    { name: "required", localizationKey: "Bạn cần phải nhập trường này !" },
    {
      name: "minlength",
      localizationKey: "PleaseEnterAtLeastNCharacter",
      propertyKey: "requiredLength",
    },
    {
      name: "maxlength",
      localizationKey: "PleaseEnterNoMoreThanNCharacter",
      propertyKey: "requiredLength",
    },
    {
      name: "email",
      localizationKey: "Địa chỉ email không hợp lệ !",
    },
    {
      name: "pattern",
      localizationKey: "Mẫu không hợp lệ !",
      propertyKey: "requiredPattern",
    },
    {
      name: "validateEqual",
      localizationKey: "Không trùng nhau !",
    },
  ];
  validationErrors = <AbpValidationError[]>this.defaultValidationErrors;

  @Input() control: AbstractControl;
  @Input() controlEl: ElementRef;

  constructor(injector: Injector, public _renderer: Renderer2) {
    super(injector);
  }

  @Input() set customValidationErrors(val: AbpValidationError[]) {
    if (val && val.length > 0) {
      const defaults = this.defaultValidationErrors.filter(
        (defaultValidationError) =>
          !val.find(
            (customValidationError) =>
              customValidationError.name === defaultValidationError.name
          )
      );
      this.validationErrors = <AbpValidationError[]>[...defaults, ...val];
    }
  }

  ngOnInit() {
    if (this.controlEl) {
      this.control.valueChanges.subscribe(() => {
        if (
          this.control.valid &&
          (this.control.dirty || this.control.touched)
        ) {
          this._renderer.removeClass(this.controlEl, "is-invalid");
        }
      });
    }
  }

  getValidationErrorMessage(error: AbpValidationError): string {
    if (this.controlEl) {
      this._renderer.addClass(this.controlEl, "is-invalid");
    }

    const propertyValue = this.control.errors[error.name][error.propertyKey];
    return !!propertyValue
      ? this.l(error.localizationKey, propertyValue)
      : this.l(error.localizationKey);
  }
}
