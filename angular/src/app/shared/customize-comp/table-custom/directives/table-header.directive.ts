import { Directive, TemplateRef } from "@angular/core";

@Directive({
  selector: "[tableHeader]",
})
export class TableHeaderDirective {
  constructor(public template: TemplateRef<any>) {}
}
