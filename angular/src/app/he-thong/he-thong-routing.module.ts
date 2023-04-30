import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RolesComponent } from "./roles/roles.component";
import { TenantsComponent } from "./tenants/tenants.component";
import { ChangePasswordComponent } from "./users/change-password/change-password.component";
import { UsersComponent } from "./users/users.component";
const routes: Routes = [
    {
        path: "roles",
        component: RolesComponent,
        data: { permission: "Pages.Roles" },
    },
    {
        path: "users",
        component: UsersComponent,
        data: { permission: "Pages.Users" },
    },
    {
        path: "users/change-password",
        component: ChangePasswordComponent,
        data: { permission: "Pages.Users.ChangPassword" },
    },
    // {
    //   path: "tenants",
    //   component: TenantsComponent,
    //   data: { permission: "Pages.Tenants" },
    // }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HeThongRoutingModule {}
