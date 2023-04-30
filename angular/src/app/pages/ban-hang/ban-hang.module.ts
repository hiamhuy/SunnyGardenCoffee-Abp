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
import { BanHangComponent } from "./ban-hang-component/ban-hang.component";
import { BanHangRoutingModule } from "../ban-hang/ban-hang-routing.module";
import { MonAnListComponent } from "./mon-an-list/mon-an-list.component";
import { DoUongListComponent } from "./do-uong-list/do-uong-list.component";
import { TableModalComponent } from "./table-modal/table-modal.component";
import { BanHangStateService } from "./service/ban-hang-state.service";
import { HoaDonThanhToanComponent } from "./hoa-don-thanh-toan/hoa-don-thanh-toan.component";

@NgModule({
    declarations: [
        BanHangComponent,
        MonAnListComponent,
        DoUongListComponent,
        TableModalComponent,
        HoaDonThanhToanComponent,
    ],
    providers: [BanHangStateService],

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
        NgxPaginationModule,
        CustomizeCompModule,
        BanHangRoutingModule,
    ],
})
export class BanHangModule {}
