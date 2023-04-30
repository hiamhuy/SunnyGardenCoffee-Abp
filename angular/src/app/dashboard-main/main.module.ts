import { DashboardComponent } from "./dashboard/dashboard-main.component";
import { NgModule } from "@angular/core";

import { MainRoutingModule } from "./main-routing.module";
import { CommonModule } from "@angular/common";
import { HttpClientModule, HttpClientJsonpModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@shared/shared.module";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ModalModule } from "ngx-bootstrap/modal";
import { TabsModule } from "ngx-bootstrap/tabs";
import { NgxPaginationModule } from "ngx-pagination";
import { CustomizeCompModule } from "../shared/customize-comp/customize-comp.module";

@NgModule({
  declarations: [DashboardComponent],
  providers: [],
  imports: [
    MainRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ModalModule.forChild(),
    BsDropdownModule,
    CollapseModule,
    TabsModule,
    SharedModule,
    NgxPaginationModule,
    CustomizeCompModule,
  ],
})
export class MainModule {}
