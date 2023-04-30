import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoaiMonAnComponent } from "././loai-mon-an/loai-mon-an.component";
import { ThucDonComponent } from "./thuc-don/thuc-don.component";
const routes: Routes = [
    {
        path: "loai",
        component: LoaiMonAnComponent,
        data: { permission: "Pages.LoaiMonAn" },
    },
    {
        path: "thuc-don",
        component: ThucDonComponent,
        data: { permission: "Pages.ThucDon" },
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MenuRoutingModule {}
