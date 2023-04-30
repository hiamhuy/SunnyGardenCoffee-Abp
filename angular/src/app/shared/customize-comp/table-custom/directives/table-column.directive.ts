import { ContentChild, Directive, Input, TemplateRef } from "@angular/core";
import { Dictionary, COL_DATA_TYPE } from "../models/types";
import { TableCellDirective } from "./table-cell.directive";
import { TableHeaderDirective } from "./table-header.directive";
import { coerceBooleanProperty } from "@node_modules/@angular/cdk/coercion";

@Directive({
  selector: 'table-column',
})
export class TableColumnDirective {
  @Input() header: string | TemplateRef<any> | null = '';
  @Input() content: string | TemplateRef<{ $implicit: Dictionary }> | null;

  @Input() headerAlign: 'left' | 'right' | 'center' | null;
  @Input() contentAlign: 'left' | 'right' | 'center' | null;
  @Input() align: 'left' | 'right' | 'center' | null;
  @Input() key = '';
  @Input() width: string | null;
  @Input() renderKey = '';
  @Input() dataType: COL_DATA_TYPE;
  
  @Input()
  get fixLeft() {
    return this._fixLeft;
  }
  set fixLeft(value: boolean) {
    this._fixLeft = coerceBooleanProperty(value);
  }
  private _fixLeft = false;

  @Input()
  get fixRight() {
    return this._fixRight;
  }
  set fixRight(value: boolean) {
    this._fixRight = coerceBooleanProperty(value);
  }
  private _fixRight = false;

  @Input() sort = false;
  @ContentChild(TableCellDirective, { static: true }) tplCell?: TableCellDirective;
  @ContentChild(TableHeaderDirective, { static: true }) tplHeader?: TableHeaderDirective;
  constructor() {}
}


