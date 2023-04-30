import {
    Component,
    EventEmitter,
    forwardRef,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { AbpSessionService } from "abp-ng2-module";
import * as _ from "lodash";
import { NzSafeAny } from "ng-zorro-antd/core/types";
import { AppUtilityService } from "../../../../shared/common/custom/utility.service";
import { CommonServiceProxy } from "../../../../shared/service-proxies/service-proxies";
import { BaseComboComponent } from "./base-combo-abstract";

@Component({
    selector: "table-combo",
    template: `
        <div class="d-flex ">
            <nz-select
                #selectOption
                [(ngModel)]="_value"
                nzShowSearch
                nzServerSearch
                [nzAllowClear]="AllowClear"
                nzPlaceHolder="{{ placeHolder }}"
                [nzMode]="nzMode"
                [nzMaxTagCount]="nzMaxTagCount"
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
        </div>
    `,
    styles: [
        `
            .ant-select,
            .ant-select-multiple .ant-select-selector {
                height: auto !important;
            }
        `,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TableComboComponent),
            multi: true,
        },
    ],
})
export class TableComboComponent extends BaseComboComponent implements OnInit, OnChanges, ControlValueAccessor {
    @ViewChild("selectOption", { static: true }) selectOption;
    @Input() TableEnum: number;
    @Input() CascaderId?: number;
    @Input() IgnoreListId: number[];
    @Input() nzMaxTagCount: any = 1;
    @Input() isDefaultFirstRecord?: boolean = false;
    @Input() DefaultCode: string = "";
    @Input() IsNumberValue?: boolean = false;
    @Input() AllowClear?: boolean = true;
    @Output() eventChange = new EventEmitter();

    constructor(private _sessionService: AbpSessionService, private _dataService: CommonServiceProxy) {
        super();
    }

    ngOnInit() {
        if (this.isMulti) {
            this.nzMode = "multiple";
        }
        if (AppUtilityService.isNullOrEmpty(this.placeHolder)) {
            this.placeHolder = "Chọn...";
        }
        this.getDataSourceFromServer();
    }

    ngAfterViewInit() {}
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.ArrCodeSkiped) {
            this.getDataSourceFromServer();
        }
        if (changes.CascaderId) {
            this.CascaderId = changes.CascaderId.currentValue;
            this.getDataSourceFromServer();
        }
    }

    getDataSourceFromServer() {
        const req: any = {
            tableEnum: this.TableEnum,
            cascaderId: this.CascaderId,
        };

        let tenantId = this._sessionService.tenantId ?? 0;
        let cascaderId = this.CascaderId ?? 0;
        const key = "combo-data-" + this.TableEnum + "-tenant-" + tenantId + "-" + cascaderId;
        const cache = sessionStorage.getItem(key);
        if (cache && this.isUseCache) {
            let lst = JSON.parse(cache);

            if (this.IgnoreListId != null) {
                if (this.IgnoreListId.length > 0) {
                    this.IgnoreListId.forEach((item) => {
                        lst = lst.filter((p) => p.value != item);
                    });
                }
            }
            this.setListOfOption(lst);

            //set value default
            this.getValueDefault(lst);

            return;
        }
        this._dataService.getDataTableCombo(req).subscribe((d) => {
            let lst = _.map(d, (it) => {
                return Object.assign(
                    {
                        ...it,
                    },
                    {
                        value: this.IsNumberValue ? parseInt(it.value) : (it.value as string),
                        displayText: AppUtilityService.isNullOrEmpty(it.displayText) ? "" : it.displayText,
                        data: it.data,
                        fts: AppUtilityService.getFullTextSearch(
                            AppUtilityService.isNullOrEmpty(it.displayText) ? "" : it.displayText
                        ),
                    }
                );
            });
            sessionStorage.setItem(key, JSON.stringify(lst));

            if (this.IgnoreListId != null) {
                if (this.IgnoreListId.length > 0) {
                    this.IgnoreListId.forEach((item) => {
                        lst = lst.filter((p) => p.value != item);
                    });
                }
            }
            this.setListOfOption(lst);

            //set value default
            this.getValueDefault(lst);
        });
    }

    getValueDefault(lst: any[]) {
        setTimeout(() => {
            if (!AppUtilityService.isNullOrEmpty(this.DefaultCode) && AppUtilityService.isNullOrEmpty(this._value)) {
                let obj = lst.find((m) => m.data.code == this.DefaultCode);
                if (obj) {
                    this._value = obj.value;
                    this.onChangeValue(obj.value);
                }
            }
            if (this.isMulti != true) {
                if (!this.optionListSource.some((p) => p.value == this._value)) {
                    this._value = null;
                    this.setValueChange(this._value);
                }
            }
            if (this.isDefaultFirstRecord == true && AppUtilityService.isNullOrEmpty(this._value)) {
                let obj = lst[0];
                if (obj) {
                    this._value = obj.value;
                    this.onChangeValue(obj.value);
                }
            }
        }, 50);
    }

    setValueChange(event) {
        this._value = event;
        this.onChangeValue(event);
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
