import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard-main.component";

const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    data: { permission: "Pages.DashBoard" },
  },
  { path: "**", redirectTo: "dashboard-main/dashboard" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
