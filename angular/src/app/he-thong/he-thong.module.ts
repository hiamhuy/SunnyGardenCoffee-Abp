import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientJsonpModule } from "@angular/common/http";
import { HttpClientModule } from "@angular/common/http";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { TabsModule } from "ngx-bootstrap/tabs";
import { NgxPaginationModule } from "ngx-pagination";
import { HeThongRoutingModule } from "./he-thong-routing.module";
import { CreateRoleDialogComponent } from "./roles/create-role/create-role-dialog.component";
import { EditRoleDialogComponent } from "./roles/edit-role/edit-role-dialog.component";
import { CreateTenantDialogComponent } from "./tenants/create-tenant/create-tenant-dialog.component";
import { EditTenantDialogComponent } from "./tenants/edit-tenant/edit-tenant-dialog.component";

import { TenantsComponent } from "./tenants/tenants.component";
import { RolesComponent } from "./roles/roles.component";
import { SharedModule } from "@shared/shared.module";
import { UsersComponent } from "./users/users.component";
import { CreateUserDialogComponent } from "./users/create-user/create-user-dialog.component";
import { EditUserDialogComponent } from "./users/edit-user/edit-user-dialog.component";
import { ResetPasswordDialogComponent } from "./users/reset-password/reset-password.component";
import { ChangePasswordComponent } from "./users/change-password/change-password.component";
import { CustomizeCompModule } from "../shared/customize-comp/customize-comp.module";
import { NzModalModule, NzModalRef } from "ng-zorro-antd/modal";
import { ModalModule } from "ngx-bootstrap/modal";
import { NgZorroAntdModule } from "@shared/shared-zorro.module";

@NgModule({
  declarations: [
    // tenants
    TenantsComponent,
    CreateTenantDialogComponent,
    EditTenantDialogComponent,
    // roles
    RolesComponent,
    CreateRoleDialogComponent,
    EditRoleDialogComponent,
    // users
    UsersComponent,
    CreateUserDialogComponent,
    EditUserDialogComponent,
    ChangePasswordComponent,
    ResetPasswordDialogComponent,
  ],
  providers: [],
  entryComponents: [
    // tenants
    TenantsComponent,
    CreateTenantDialogComponent,
    EditTenantDialogComponent,
    // roles
    RolesComponent,
    CreateRoleDialogComponent,
    EditRoleDialogComponent,
    // users
    UsersComponent,
    CreateUserDialogComponent,
    EditUserDialogComponent,
    ChangePasswordComponent,
    ResetPasswordDialogComponent,
  ],
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
    HeThongRoutingModule,
    NgxPaginationModule,
    CustomizeCompModule,
    NgZorroAntdModule,
  ],
})
export class HeThongModule {}
