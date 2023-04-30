import {
    AfterViewInit,
    Component,
    ElementRef,
    forwardRef,
    Input,
    OnDestroy,
    OnInit,
    Provider,
    ViewChild,
} from "@angular/core";
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";
import * as _ from "lodash";
import { DateTime } from "luxon";
import * as moment from "moment/moment";
import { NzDatePickerComponent } from "ng-zorro-antd/date-picker";
import { fromEvent, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatePickerComponent),
    multi: true,
};

@Component({
    selector: "input-date-picker",
    template: `
        <nz-input-group style="display: flex;">
            <ng-container *ngIf="isShowChooseDates">
                <button
                    class="btn btn-xs btn-secondary"
                    style="padding: 3px 8px;"
                    nz-dropdown
                    [nzDropdownMenu]="menuDateTime"
                    nzPlacement="bottomLeft"
                >
                    <i nz-icon nzType="filter" nzTheme="outline"></i>
                </button>
                <nz-dropdown-menu #menuDateTime="nzDropdownMenu">
                    <ul nz-menu>
                        <li
                            class="{{ item.class }}"
                            nz-menu-item
                            *ngFor="let item of lstConfigDate"
                            (click)="onChangeDate(item)"
                        >
                            {{ item.name }}
                        </li>
                    </ul>
                </nz-dropdown-menu>
            </ng-container>

            <div
                class="main-custom-date"
                style="width: 100%;"
                (mouseenter)="mouseEnterMain()"
                (mouseleave)="mouseLeaveMain()"
            >
                <nz-date-picker
                    class="custom-date"
                    #refDate
                    style="width:100%"
                    [nzPlaceHolder]="placeHolder"
                    [nzDisabledDate]="disabledDate"
                    tabindex="-1"
                    [formControl]="control"
                    [nzDisabled]="_isDisabled"
                    nzFormat="dd/MM/yyyy"
                ></nz-date-picker>
                <input
                    #refInput
                    class="custom-input-date {{ _isDisabled ? 'disable' : '' }}"
                    nz-input
                    [placeholder]="placeHolder"
                    [disabled]="_isDisabled"
                    [formControl]="_inputValue"
                />
                <i
                    class="custom-close far fa-times-circle"
                    [hidden]="_isShowIconCalendar"
                    (click)="onClearClick()"
                    *ngIf="!_isDisabled"
                ></i>

                <i
                    class="custom-calendar"
                    [hidden]="!_isShowIconCalendar"
                    (click)="refDate.picker.showOverlay()"
                    *ngIf="!_isDisabled"
                    nz-icon
                    nzType="calendar"
                    nzTheme="outline"
                ></i>
            </div>
        </nz-input-group>
    `,
    styles: [
        `
            .main-custom-date {
                position: relative;
            }

            .custom-date {
                border: none;
            }

            .custom-input-date {
                position: absolute;
                top: 0;
                left: 0;
            }

            .custom-close {
                position: absolute;
                top: 7px;
                right: 5px;
            }

            .custom-calendar {
                position: absolute;
                top: 7px;
                right: 5px;
            }

            .disable {
                background-color: #fff;
                cursor: not-allowed;
                opacity: 1;
                color: #000;
                pointer-events: none;
                border: none;
            }
        `,
    ],
    providers: [VALUE_ACCESSOR],
})
export class DatePickerComponent implements OnInit, ControlValueAccessor, AfterViewInit, OnDestroy {
    @ViewChild("refDate") refDate: NzDatePickerComponent;
    @ViewChild("refInput") refInput: ElementRef;
    @Input() disabledDate?: (d: Date) => boolean;
    @Input() isShowChooseDates?: boolean = false;
    @Input() sDisabled? = false;
    @Input() placeHolder = "Ngày/Tháng/Năm";
    _mask = [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/];
    $destroy: Subject<boolean> = new Subject<boolean>();
    isWriteValue = false;

    _isShowIconCalendar = true;
    lstConfigDate = [
        { id: 1, name: "7 ngày sau", class: "" },
        { id: 2, name: "30 ngày sau", class: "" },
        { id: 3, name: "Cuối tháng này", class: "" },
        { id: 4, name: "Cuối tháng sau", class: "" },
        { id: 5, name: "Quý 1 năm nay", class: "" },
        { id: 6, name: "Quý 2 năm nay", class: "" },
        { id: 7, name: "Quý 3 năm nay", class: "" },
        { id: 8, name: "Quý 4 năm nay", class: "" },
        { id: 9, name: "Cuối năm", class: "" },
    ];
    get value() {
        return this.control.value;
    }

    set value(v: any) {
        this.control.setValue(v);
    }

    _isDisabled = false;

    @Input()
    get disabled() {
        this._isDisabled = this.sDisabled;
        return this._isDisabled;
    }

    set disabled(v: boolean) {
        if (v) {
            this.control.disable();
        } else {
            this.control.enable();
        }
    }

    @Input() control = new FormControl({ value: "", disabled: this._isDisabled });
    _inputValue: FormControl = new FormControl({
        value: undefined,
        disabled: this._isDisabled,
    });

    private onChange = (v: any) => {};
    private onTouched = () => {};

    onChangeValue(event: any): void {
        this.onChange(event);
        // this.refDate.picker.hideOverlay();
    }

    onFocus(event: any): void {
        this.onTouched();
    }

    mouseLeaveMain() {
        this._isShowIconCalendar = true;
    }

    mouseEnterMain() {
        if (this._inputValue.value) {
            this._isShowIconCalendar = false;
        } else {
            this._isShowIconCalendar = true;
        }
    }

    constructor() {}

    ngAfterViewInit(): void {
        fromEvent<any>(this.refInput.nativeElement, "click")
            .pipe(debounceTime(400), takeUntil(this.$destroy))
            .subscribe(() => {
                this.onInputClick();
            });
    }

    onInputClick() {
        this.refDate.picker.showOverlay();
        setTimeout(() => {
            // this will make the execution after the above boolean has changed
            this.refInput.nativeElement.focus();
        }, 0);
    }

    onClearClick() {
        this._inputValue.setValue(undefined);
        this.onChange(undefined);
        this._isShowIconCalendar = true;
    }

    ngOnDestroy(): void {
        this.$destroy.next(true);
        this.$destroy.unsubscribe();
    }

    ngOnInit(): void {
        this.control.valueChanges
            .pipe(
                takeUntil(this.$destroy),
                distinctUntilChanged((prev, curr) => {
                    return _.isEqual(prev, curr);
                })
            )
            .subscribe((result: Date) => {
                if (this.isWriteValue) {
                    if (result) {
                        const valueText = DateTime.fromJSDate(result).toFormat("dd/MM/yyyy");
                        this._inputValue.setValue(valueText);
                        this.onChangeValue(DateTime.fromJSDate(result));
                    }
                }
            });
        this._inputValue.valueChanges
            .pipe(takeUntil(this.$destroy), distinctUntilChanged(), debounceTime(100))
            .subscribe((result) => {
                try {
                    const arrStr = result.split("/");
                    if (!isNaN(arrStr[0]) && !isNaN(arrStr[1]) && !isNaN(arrStr[2])) {
                        const date = DateTime.fromFormat(result, "dd/MM/yyyy");
                        if (date.isValid) {
                            if (typeof this.disabledDate === "function") {
                                if (this.disabledDate(date.toJSDate())) {
                                    this._inputValue.setValue(undefined);
                                } else {
                                    this.control.setValue(date.toJSDate());
                                    this.refDate.picker.hideOverlay();
                                }
                            } else {
                                this.control.setValue(date.toJSDate());
                                this.refDate.picker.hideOverlay();
                            }
                        } else {
                            this.control.setValue(undefined);
                        }
                    } else {
                        this.control.setValue(undefined);
                    }
                } catch (e) {
                    this.control.setValue(undefined);
                }
            });
    }

    //#region base ControlValueAccessor
    writeValue(obj: DateTime): void {
        if (obj) {
            this.value = obj.toJSDate();
            const valueText = obj.toFormat("dd/MM/yyyy");
            this._inputValue.setValue(valueText);
        } else if (this.isWriteValue) {
            this._inputValue.setValue(undefined);
        }
        this.isWriteValue = true;
    }

    registerOnChange(fn: () => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this._isDisabled = isDisabled;
    }

    //#endregion

    onChangeDate = function (items) {
        var days; // Days you want to subtract

        if (items.id <= 2) {
            if (items.id == 1) {
                days = 7;
            } else if (items.id == 2) {
                days = 30;
            }

            var date = new Date();
            var last = new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
            var day = last.getDate();
            var month = last.getMonth();
            var year = last.getFullYear();
            this.value = last;
            //this.startDateRange = new Date(year, month, day);
        } else if (items.id > 2 && items.id <= 4) {
            var date = new Date();
            let lastDay = new Date();

            if (items.id == 3) {
                lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            } else if (items.id == 4) {
                lastDay = new Date(date.getFullYear(), date.getMonth() + 2, 0);
            }
            this.value = lastDay;
        } else if (items.id > 4 && items.id <= 8) {
            // cac quy nam nay
            var date = new Date();
            var year = date.getFullYear();
            if (items.id == 5) {
                this.value = new Date(year, 2, 31);
            } else if (items.id == 6) {
                this.value = new Date(year, 5, 30);
            } else if (items.id == 7) {
                this.value = new Date(year, 8, 30);
            } else if (items.id == 8) {
                this.value = new Date(year, 11, 31);
            }
        } else {
            var date = new Date();
            var year = date.getFullYear();
            this.value = new Date(year, 11, 31);
        }

        for (let item of this.lstConfigDate) {
            item.class = "";
        }
        items.class = "oda-active";
        this.itemsId = items.id;

        // this.minDateEnd = this.startDateRange;
        // this.maxDateStart = this.endDateRange;
    };
}
