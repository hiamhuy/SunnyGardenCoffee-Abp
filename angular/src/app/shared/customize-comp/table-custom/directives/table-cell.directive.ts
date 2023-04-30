import { Directive, TemplateRef } from "@angular/core";

@Directive({
  selector: "[tableCell]",
})
export class TableCellDirective {
  constructor(public template: TemplateRef<any>) {}
}
