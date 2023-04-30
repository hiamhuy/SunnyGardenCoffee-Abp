import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LayoutPageListCustomComponent } from "./layout-page-list-custom/layout-page-list-custom.component";
import { PagingListCustomComponent } from "./paging-list-custom/paging-list-custom.component";
import { FilterSpinComponent } from "./filter-spin/filter-spin.component";
import { TableModule } from "./table-custom/table.module";
import { NgZorroAntdModule } from "../../../shared/shared-zorro.module";
import { HttpClientModule, HttpClientJsonpModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@shared/shared.module";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TabsModule } from "ngx-bootstrap/tabs";
import { InputNumberComponent } from "./input-number/input-number.component";
import { DatePickerComponent } from "./input-date-picker/input-date-picker.component";
import { DateTimePickerComponent } from "./input-date-time-picker/input-date-time-picker.component";
import { InputUpDownNumberComponent } from "./input-up-down-number/input-up-down-number.component";
import { InputPriceComponent } from "./input-price/input-price.component";
import { UploadImageComponent } from "./upload-image/upload-image.component";
import { InputPercenComponent } from "./input-percen/input-percen.component";

var customizeComp = [
    PagingListCustomComponent,
    LayoutPageListCustomComponent,
    FilterSpinComponent,
    InputNumberComponent,
    DatePickerComponent,
    DateTimePickerComponent,
    InputUpDownNumberComponent,
    InputPriceComponent,
    UploadImageComponent,
    InputPercenComponent,
];
@NgModule({
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
        NgZorroAntdModule,
    ],
    declarations: [...customizeComp],
    exports: [...customizeComp, TableModule, NgZorroAntdModule],
})
export class CustomizeCompModule {}
