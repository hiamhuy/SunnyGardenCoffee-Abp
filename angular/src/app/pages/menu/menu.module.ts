import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientJsonpModule } from "@angular/common/http";
import { HttpClientModule } from "@angular/common/http";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { TabsModule } from "ngx-bootstrap/tabs";
import { NgxPaginationModule } from "ngx-pagination";
import { SharedModule } from "../../../shared/shared.module";
import { CustomizeCompModule } from "../../shared/customize-comp/customize-comp.module";
import { MenuRoutingModule } from "./menu-routing.module";
import { LoaiMonAnComponent } from "./loai-mon-an/loai-mon-an.component";
import { ThucDonComponent } from "./thuc-don/thuc-don.component";
import { LoaiCreateOrUpdateComponent } from "./loai-mon-an/loai-create-or-update/loai-create-or-update.component";
import { ThucDonCreateOrEditComponent } from "./thuc-don-create-or-edit/thuc-don-create-or-edit.component";
import { DataCompModule } from "@app/shared/data-comp/data-comp.module";

@NgModule({
    declarations: [ThucDonComponent, LoaiMonAnComponent, LoaiCreateOrUpdateComponent, ThucDonCreateOrEditComponent],
    providers: [],

    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        BsDropdownModule,
        CollapseModule,
        TabsModule,
        SharedModule,
        DataCompModule,
        NgxPaginationModule,
        CustomizeCompModule,
        MenuRoutingModule,
    ],
})
export class MenuModule {}
