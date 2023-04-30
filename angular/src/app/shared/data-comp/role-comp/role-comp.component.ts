import { Component, forwardRef, Injector, Input, OnInit, SimpleChanges } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { AppUtilityService } from "@shared/common/custom/utility.service";
import { NhanVienAppServicesServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize, map } from "rxjs/operators";
import { BaseComboComponent } from "../_data/base-combo-abstract";

@Component({
    selector: "role-comp",
    template: ` <div class="custom-combo">
        <ng-container *ngIf="!_isDisabled">
            <nz-select
                nzShowSearch
                nzServerSearch
                [nzMaxTagCount]="maxTagCount"
                [nzMaxTagPlaceholder]="maxTagPlaceholderTmpl"
                [nzAllowClear]="nzAllowClear"
                nzPlaceHolder="{{ placeHolders }}"
                [nzMode]="nzMode"
                [nzLoading]="loading"
                [(ngModel)]="_value"
                [nzDisabled]="_isDisabled"
                (nzFocus)="(onFocus)"
                style="width:100%"
                (ngModelChange)="onChangeValue($event)"
                (nzOnSearch)="search($event)"
                [nzDropdownClassName]="'oda-select-dropdown'"
                [nzDropdownRender]="renderTemplate"
                [nzSuffixIcon]="prefixTemplateUser"
            >
                <nz-option *ngFor="let item of optionList" [nzLabel]="item.displayText" [nzValue]="item.value">
                </nz-option>

                <ng-template #prefixTemplateUser><i nz-icon nzType="down" nzTheme="outline"></i></ng-template>
            </nz-select>
        </ng-container>
        <input *ngIf="_isDisabled" nz-input [ngModel]="svalue" readonly />
        <ng-template #maxTagPlaceholderTmpl let-selectedList>+ {{ selectedList.length }} </ng-template>
    </div>`,
    styles: [
        `
            .custom-combo {
                display: flex;
                width: 100%;
                align-items: center;
                justify-content: center;
            }

            .custom-combo nz-select {
                width: 100%;
            }

            .custom-close {
                cursor: pointer;
            }
        `,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RoleCompComponent),
            multi: true,
        },
    ],
})
export class RoleCompComponent extends BaseComboComponent implements OnInit {
    @Input() placeHolders?: string = "- Chọn -";
    @Input() nzAllowClear?: boolean = true;
    maxOptionRender = 50;
    loading = false;

    constructor(injector: Injector, private dataService: NhanVienAppServicesServiceProxy) {
        super();
    }

    ngOnInit() {
        if (this.isMulti) {
            this.nzMode = "multiple";
        }
        this.getDataSourceFromServer();
    }
    ngOnChanges(changes: SimpleChanges): void {
        this.getDataSourceFromServer();
    }

    getDataSourceFromServer() {
        this.loading = true;
        this.dataService
            .getRole()
            .pipe(
                map((list) => {
                    return list.map((item) => {
                        return Object.assign(item, {
                            fts: AppUtilityService.getFullTextSearch(item.displayText),
                        });
                    });
                }),
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe((result) => {
                this.setListOfOption(result);
                this.addSelectedNotInRender();
            });
    }
}
