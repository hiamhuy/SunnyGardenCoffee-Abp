import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import * as _ from "lodash";
import { AppUtilityService } from "../../../../shared/common/custom/utility.service";
import { CommonServiceProxy } from "../../../../shared/service-proxies/service-proxies";
import { BaseComboComponent } from "./base-combo-abstract";

@Component({
    selector: "enum-combo",
    template: `
        <ng-container *ngIf="!_isDisabled">
            <nz-select
                nzShowSearch
                nzServerSearch
                nzAllowClear="{{ AllowClear }}"
                nzPlaceHolder="{{ placeHolder }}"
                [nzMode]="'multiple'"
                [nzMaxTagCount]="nzMaxTagCount"
                [(ngModel)]="_value"
                [nzDisabled]="_isDisabled"
                (nzFocus)="(onFocus)"
                style="width:100%"
                (ngModelChange)="onChangeValue($event)"
                (nzOnSearch)="search($event)"
            >
                <nz-option
                    *ngFor="let item of optionList"
                    [nzLabel]="item.displayText"
                    [nzValue]="item.value"
                ></nz-option>
            </nz-select>
        </ng-container>
        <input *ngIf="_isDisabled" nz-input [ngModel]="svalue" readonly />
    `,
    styles: [
        `
            .ant-select,
            .ant-select-multiple.ant-select-selector {
                height: auto !important;
            }
            .ant-select-multiple .ant-select-selector {
                height: auto !important;
            }
        `,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => EnumComboComponent),
            multi: true,
        },
    ],
})
export class EnumComboComponent extends BaseComboComponent implements OnInit, ControlValueAccessor {
    @Input() EnumCode: 0; //ComboBoxEnumCode
    @Input() nzMaxTagCount: any = 1;
    @Input() AllowClear: boolean = true;
    @Output() eventChange = new EventEmitter();
    constructor(private _commonService: CommonServiceProxy) {
        super();
    }

    ngOnInit() {
        if (this.isMulti) {
            // this.nzMode = "multiple";
        }
        this.isUseCache = true;
        this.getDataSource();
    }

    getDataSource() {
        const key = "combo-enum-" + this.EnumCode;
        const cache = sessionStorage.getItem(key);
        if (cache && this.isUseCache) {
            let lst = JSON.parse(cache);

            this.setListOfOption(lst);
            this.addSelectedNotInRender();
            return;
        }

        this.getDataSourceFromServer();
    }

    getDataSourceFromServer() {
        this._commonService.getAppEnum(this.EnumCode).subscribe((result) => {
            let data = _.map(result, (it) => {
                return Object.assign(
                    {},
                    {
                        value: Number(it.value),
                        displayText: it.displayText,
                        fts: AppUtilityService.getFullTextSearch(it.displayText),
                    }
                );
            });

            //keyCache
            // if (keyCache) {
            //   sessionStorage.setItem(keyCache, JSON.stringify(data));
            // }

            //setData
            this.setListOfOption(data);
        });
    }

    onChangeValue(event) {
        this.onChange(event);
        if (this.isMulti != true) {
            let obj = this.optionList.find((m) => m.value == event);
            this.eventChange.emit(obj);
        } else {
            if (this._value != null) {
                let ListChosen = this.optionList.filter((m) => this._value.includes(m.value));
                this.eventChange.emit(ListChosen);
            } else {
                this.eventChange.emit([]);
            }
        }
    }
}
