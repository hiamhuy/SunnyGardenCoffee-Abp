import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BanHangComponent } from "./ban-hang-component/ban-hang.component";
const routes: Routes = [
    {
        path: "",
        component: BanHangComponent,
        data: { permission: "Pages.BanHang" },
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BanHangRoutingModule {}
