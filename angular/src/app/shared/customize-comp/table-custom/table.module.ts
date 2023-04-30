import { NgModule } from "@angular/core";
import { OnlyNumberDirective } from "../directives/only-number-directive";
import { TableColumnDirective } from "../table-custom/directives/table-column.directive";
import { TableCellDirective } from "../table-custom/directives/table-cell.directive";
import { TableHeaderDirective } from "../table-custom/directives/table-header.directive";
import { TablePaginationComponent } from "../table-custom/table-pagination/table-pagination.component";
import { TableCustomComponent } from "../table-custom/table-custom.component";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzOutletModule } from "ng-zorro-antd/core/outlet";
import { NzEmptyModule } from "ng-zorro-antd/empty";
import { NzGridModule } from "ng-zorro-antd/grid";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzPaginationModule } from "ng-zorro-antd/pagination";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzTableModule } from "ng-zorro-antd/table";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

const COM_EXPORT = [
  TableCustomComponent,
  TableColumnDirective,
  TableCellDirective,
  TableHeaderDirective,
  TablePaginationComponent,
];
const DIRECTIVES = [OnlyNumberDirective];
@NgModule({
  declarations: [...COM_EXPORT, DIRECTIVES],
  exports: [...COM_EXPORT, DIRECTIVES],
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzOutletModule,
    NzPaginationModule,
    NzButtonModule,
    NzSelectModule,
    NzIconModule,
    NzInputModule,
    NzGridModule,
    NzEmptyModule,
  ],
  providers: [],
  entryComponents: [],
})
export class TableModule {}
