import { Directive, EventEmitter, Input, Output } from "@angular/core";
import * as _ from "lodash";
import { NzSafeAny } from "ng-zorro-antd/core/types";
import { NzSelectModeType } from "ng-zorro-antd/select";
import { AppUtilityService } from "../../../../shared/common/custom/utility.service";

@Directive()
export abstract class BaseComboComponent {
    @Input() isUseCache?: boolean = false;
    @Input() serviceUX: NzSafeAny;
    @Input() placeHolder = "- Chọn -";
    @Input() isMulti: any;
    @Output() eventChange = new EventEmitter<any>();
    nzMode: NzSelectModeType = "default";
    // tslint:disable-next-line:variable-name
    _value: any | string | number = "";
    public optionList: any[] = [];
    public optionListSource: any[] = [];
    // tslint:disable-next-line:variable-name
    _isDisabled = false;
    loading = false;
    isMustSetNull = false;
    protected maxOptionRender = 1000;
    @Input() maxTagCount = 222;
    public onChange = (v: any) => {};
    private onTouched = () => {};

    constructor() {}

    @Input()
    get value() {
        return this.value;
    }

    set value(v: any) {
        this._value = v;
    }

    get svalue() {
        if (this.isMulti) {
            if (this._value && this._value.length > 0) {
                let selectedItem = this.optionListSource.filter((m) => this._value.findIndex((v) => v == m.value) > -1);
                if (selectedItem.length > 0) {
                    return selectedItem.map((x) => x.displayText).join("; ");
                }
            }
        } else {
            if (this._value != null) {
                let selectedItem = this.optionListSource.find((m) => m.value == this._value);
                if (selectedItem != null) {
                    return selectedItem.displayText;
                }
            }
        }

        return "";
    }

    @Input()
    get disabled() {
        return this._isDisabled;
    }

    set disabled(v: boolean) {
        this._isDisabled = v;
    }

    onChangeValue(event: any): void {
        this.onChange(event);
        let selectedItem = this.optionList.find((x) => x.value == event);
        if (selectedItem) {
            this.eventChange.emit(selectedItem.data);
        } else {
            this.eventChange.emit(null);
        }
    }

    onFocus(event: any): void {
        this.onTouched();
    }

    writeValue(obj: any): void {
        this._value = obj;
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

    trackByFn(index: number, item: any) {
        if (item && item.value) {
            return item.value;
        }
        return index;
    }

    search(value: string): void {
        if (AppUtilityService.isNotAnyItem(this.optionListSource) === true) {
            this.optionList = [];
            return;
        }
        const searchTxt = AppUtilityService.getFullTextSearch(value);
        let fOption = this.optionListSource;
        if (AppUtilityService.isNotNull(searchTxt)) {
            fOption = _.filter(fOption, (s) => {
                const ftsVietTat = AppUtilityService.searchVietTat(s.displayText);
                const checkVietTat = ftsVietTat.indexOf(searchTxt) > -1;
                if (AppUtilityService.isNullOrEmpty(s.fts)) {
                    s.fts = AppUtilityService.getFullTextSearch(s.displayText);
                }
                return s.fts.indexOf(searchTxt) > -1 || checkVietTat;
            });
        }
        this.optionList = _.slice(fOption, 0, this.maxOptionRender);
    }

    setDataSourceFromResultService(result) {
        const lst = _.map(result, (it) => {
            return Object.assign(
                {},
                {
                    value: it.value,
                    displayText: it.displayText,
                    data: it.data,
                    fts: AppUtilityService.getFullTextSearch(it.displayText),
                }
            );
        });
        this.setListOfOption(lst);
    }

    setListOfOption(d) {
        this.optionListSource = d;
        this.optionList = _.slice(this.optionListSource, 0, this.maxOptionRender);
    }

    addRecordNullOfList(value: number, lst) {
        if (value != null) {
            let obj = this.optionList.find((m) => m.value == value);
            if (obj == null) {
                let recordSelected = lst.find((m) => m.value == value);
                this.optionList.push(recordSelected);
            }
        }
    }

    setValueNull() {
        setTimeout(() => {
            this._value = null;
            this.onChangeValue(null);
        });
    }

    addSelectedNotInRender() {
        let selectedValue = this._value;
        if (this.isMulti) {
            if (selectedValue && selectedValue.length > 0) {
                selectedValue.forEach((item) => {
                    let index = this.optionList.findIndex((m) => m.value == item);
                    if (index === -1) {
                        let selectedItem = this.optionListSource.find((m) => m.value == item);
                        if (selectedItem) {
                            this.optionList.push(selectedItem);
                        }
                    }
                });
            }
        } else {
            if (selectedValue != null) {
                let index = this.optionList.findIndex((m) => m.value == selectedValue);
                if (index === -1) {
                    let selectedItem = this.optionListSource.find((m) => m.value == selectedValue);
                    if (selectedItem) {
                        this.optionList.push(selectedItem);
                    }
                }
            }
        }
    }
}
