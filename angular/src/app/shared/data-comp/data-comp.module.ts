import { CommonModule } from "@angular/common";
import { NgModule, Pipe } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "../../../shared/shared-zorro.module";
import { CustomizeCompModule } from "../customize-comp/customize-comp.module";
import { TableComboComponent } from "./_data/table-combo.component";
import { EnumComboComponent } from "./_data/enum-combo.component";
import { RoleCompComponent } from "./role-comp/role-comp.component";
const componentsEx = [EnumComboComponent, TableComboComponent, RoleCompComponent];

const moduleExtend = [];

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, NgZorroAntdModule, CustomizeCompModule, ...moduleExtend],
    declarations: [...componentsEx],
    exports: [...componentsEx],
    providers: [
        // DestroyRxjsService,
    ],
})
export class DataCompModule {}
