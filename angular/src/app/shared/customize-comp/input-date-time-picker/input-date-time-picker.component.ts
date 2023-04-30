import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Provider,
  ViewChild,
} from "@angular/core";
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";
import { differenceInCalendarDays } from "date-fns";
import * as $ from "jquery";
import * as _ from "lodash";
import { DateTime } from "luxon";
import * as moment from "moment";
import { NzDatePickerComponent } from "ng-zorro-antd/date-picker";
import { fromEvent, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateTimePickerComponent),
  multi: true,
};

@Component({
  selector: "date-time-picker",
  template: `
    <div class="main-ora-date" (mouseenter)="mouseEnterMain()" (mouseleave)="mouseLeaveMain()">
      <nz-date-picker
        class="ora-date"
        #refDate
        style="width:100%;position: absolute;"
        [nzPlaceHolder]="placeHolder"
        [nzDisabledDate]="disabledDate"
        [nzDisabled]="isDisabled"
        tabindex="-1"
        [formControl]="control"
        [nzDisabledDate]="disabledDates"
        (ngModelChange)="onChangeValue($event)"
        nzFormat="dd/MM/yyyy HH:mm:ss"
      ></nz-date-picker>
      <div class="d-flex" style="position: absolute;height: auto;height: 30px;width: 100%;background: #ffff;">
        <div style="width: 100%;">
          <input
            #refDateInput
            class="ora-input-date oras-input-date {{ _isDisabled == true ? 'ora-input-date-disabled' : '' }}"
            nz-input
            [placeholder]="placeHolder"
            [formControl]="_inputDateValue"
            disabled="{{ _isDisabled }}"
            readonly="{{ readOnly }}"
            (ngModelChange)="onChangeDateValue($event)"
          />
        </div>
        <div style="width: {{ widthTime ? widthTime : '50px' }};" *ngIf="isShowTime">
          <input
            #refTimeInput
            style="width: {{ widthTime ? widthTime : '50px' }};"
            class="ora-input-date ora-input-date-time {{ _isDisabled == true ? 'ora-input-date-disabled' : '' }}"
            nz-input
            placeholder="__:__"
            [formControl]="_inputTimeValue"
            [textMask]="{ mask: _maskTime }"
            disabled="{{ _isDisabled }}"
            readonly="{{ readOnly }}"
            (ngModelChange)="onChangeTimeValue($event)"
          />
        </div>
      </div>

      <i
        class="ora-close"
        *ngIf="_isDisabled == true ? !isIcon : isIcon"
        [hidden]="_isShowIconCalendar"
        (click)="onClearClick()"
        nz-icon
        nzType="close-circle"
        nzTheme="outline"
      ></i>
      <i
        class="ora-calendar"
        #oraCalendar
        *ngIf="isIcon"
        [hidden]="!_isShowIconCalendar"
        nz-icon
        nzType="calendar"
        nzTheme="outline"
      ></i>
    </div>
  `,
  styles: [
    `
      .main-ora-date {
        position: relative;
        width: 100%;
        min-height: 30px;
      }
      .main-ora-date .ant-picker.ant-picker-disabled {
        border: none;
      }
      .oras-input-date {
        padding-right: 5px;
      }
      .ora-date {
        border: 0;
      }
      /* .ora-input-date{
            background-color: #fff;
        }
        .ora-input-date {
            position: absolute;
            top: 0;
            left: 0
        } */

      .ora-close {
        position: absolute;
        top: 7px;
        right: 5px;
      }

      .ora-calendar {
        position: absolute;
        top: 7px;
        right: 5px;
      }

      .ora-input-date-disabled {
        color: black;
        background-color: #fff;
        cursor: pointer;
        opacity: 1;
      }
      .ant-input[readonly] {
        border: 1px solid #b1b0b0 !important;
      }
    `,
  ],
  providers: [VALUE_ACCESSOR],
})
export class DateTimePickerComponent implements OnInit, ControlValueAccessor, AfterViewInit, OnDestroy {
  @ViewChild("refDate") refDate: NzDatePickerComponent;
  @ViewChild("refDateInput") refDateInput: ElementRef;
  @ViewChild("refTimeInput") refTimeInput: ElementRef;
  @ViewChild("oraCalendar") oraCalendar: ElementRef;
  @Input() disabledDate?: (d: Date) => boolean;
  @Input() isIcon?: boolean = true;
  @Input() isShowTime?: boolean = true;
  @Input() widthTime?: string = "80px";
  @Input() isDisabled?: boolean = false;
  @Input() readOnly?: boolean = false;
  @Input() placeHolder = "dd/MM/yyyy";
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  _maskDate = [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/];
  _maskTime = [/\d/, /\d/, ":", /\d/, /\d/];
  $destroy: Subject<boolean> = new Subject<boolean>();
  isWriteValue = false;
  _isOnChange = false;
  _isShowIconCalendar = true;
  dateTime = new Date();

  @Output() eventChange = new EventEmitter();

  get value() {
    return this.control.value;
  }

  set value(v: any) {
    this.control.setValue(v);
  }

  _isDisabled = false;

  @Input()
  get disabled() {
    return this._isDisabled;
  }

  set disabled(v: boolean) {
    this._isDisabled = v;
  }

  @Input() control = new FormControl({ value: "", disabled: false });
  _inputDateValue: FormControl = new FormControl({
    value: undefined,
    disabled: this._isDisabled,
  });
  _inputTimeValue: FormControl = new FormControl({
    value: undefined,
    disabled: this._isDisabled,
  });

  private onChange = (v: any) => {};

  private onTouched = () => {};

  onChangeValue(e: any) {
    this.eventChange.emit();
  }

  onChangeDateValue(event: any): void {
    this.onChange(event);
    if (
      !event ||
      event == undefined ||
      ((event != null || event != undefined) && event.length <= 10 && event.toString().indexOf("_") !== -1)
    ) {
      this._isOnChange = true;
      return;
    } else {
      const date = moment(event, "DD/MM/YYYY", true).isValid();
      if (!date) {
        this._inputDateValue.setValue(undefined);
        return;
      }
    }
  }

  onChangeTimeValue(event: any): void {
    this.onChange(event);
    if (
      !event ||
      event == undefined ||
      ((event != null || event != undefined) && event.length <= 5 && event.toString().indexOf("_") !== -1)
    ) {
      return;
    } else {
      const spl = event.split(":");
      const h = Number(spl[0]);
      const m = Number(spl[1]);
      if (!(h >= 0 && h < 24) || !(m >= 0 && m <= 59)) {
        this._inputTimeValue.setValue(moment(new Date()).format("HH:mm"));
      }
    }
  }

  onFocus(event: any): void {
    this.onTouched();
  }

  mouseLeaveMain() {
    this._isShowIconCalendar = true;
  }

  mouseEnterMain() {
    if (this._inputDateValue.value) {
      this._isShowIconCalendar = false;
    } else {
      this._isShowIconCalendar = true;
    }
  }

  constructor() {}

  ngAfterViewInit(): void {
    fromEvent<any>(this.refDateInput.nativeElement, "click")
      .pipe(debounceTime(400), takeUntil(this.$destroy))
      .subscribe(() => {
        this.onInputDateClick();
      });

    fromEvent<any>($("app-root"), "click")
      .pipe(debounceTime(0), takeUntil(this.$destroy))
      .subscribe(() => {
        this.refDate.picker.hideOverlay();
        this.refDate.nzOpen = false;
      });
    fromEvent<any>(document, "keydown")
      .pipe(debounceTime(0), takeUntil(this.$destroy))
      .subscribe((event) => {
        if (event.code == "Tab") {
          this.refDate.picker.hideOverlay();
          this.refDate.nzOpen = false;
        }
      });
    fromEvent<any>($("nz-modal-container"), "click")
      .pipe(debounceTime(0), takeUntil(this.$destroy))
      .subscribe(() => {
        this.refDate.picker.hideOverlay();
        this.refDate.nzOpen = false;
      });
  }

  onInputDateClick() {
    this.refDate.picker.showOverlay();
    this.refDate.nzOpen = true;
    setTimeout(() => {
      // this will make the execution after the above boolean has changed
      this.refDateInput.nativeElement.focus();
      fromEvent<any>($(".ant-picker-cell-selected, .ant-picker-today-btn"), "click")
        .pipe(debounceTime(0), takeUntil(this.$destroy))
        .subscribe(() => {
          this.refDate.picker.hideOverlay();
          this.refDate.nzOpen = false;
        });
    }, 0);
  }

  onInputTimeClick() {
    this.refDate.picker.showOverlay();
    setTimeout(() => {
      // this will make the execution after the above boolean has changed
      this.refTimeInput.nativeElement.focus();
    }, 0);
  }

  onClearClick() {
    this._inputDateValue.setValue(undefined);
    this._inputTimeValue.setValue(undefined);
    this._isShowIconCalendar = true;
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
  }

  ngOnInit(): void {
    this.setDisabledState(this.isDisabled);
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
            this.dateTime = result;
            const valueTextDate = DateTime.fromJSDate(result).toFormat("dd/MM/yyyy");
            const valueTextTime = DateTime.fromJSDate(result).toFormat("HH:mm");
            this._inputDateValue.setValue(valueTextDate);
            this._inputTimeValue.setValue(valueTextTime);
            this.onChangeTimeValue(valueTextTime);
          }

          this.onChangeDateValue(result);
        }
      });
    this._inputDateValue.valueChanges
      .pipe(takeUntil(this.$destroy), distinctUntilChanged(), debounceTime(100))
      .subscribe((result) => {
        try {
          const arrStr = result.split(" ").join("/").split(":").join("/").split("/");
          if (!isNaN(arrStr[0]) && !isNaN(arrStr[1]) && !isNaN(arrStr[2])) {
            const date = DateTime.fromFormat(result, "dd/MM/yyyy");
            if (date.isValid) {
              //set ngày giờ
              const gio = DateTime.fromJSDate(this.dateTime).toFormat("HH:mm:ss");
              const ngaygio = DateTime.fromFormat(result + " " + gio, "dd/MM/yyyy HH:mm:ss");
              this.control.setValue(ngaygio.toJSDate());
              this.refDate.picker.hideOverlay();
              this.refDate.nzOpen = false;
              if (this.minDate || this.maxDate) {
                const dateTimeCheck = DateTime.fromFormat(result, "dd/MM/yyyy").toJSDate();
                if (differenceInCalendarDays(dateTimeCheck, this.minDate) < 0) {
                  this._inputDateValue.setValue(undefined);
                  return;
                }

                if (differenceInCalendarDays(dateTimeCheck, this.maxDate) > 0) {
                  this._inputDateValue.setValue(undefined);
                  return;
                }
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

    this._inputTimeValue.valueChanges
      .pipe(takeUntil(this.$destroy), distinctUntilChanged(), debounceTime(100))
      .subscribe((result) => {
        try {
          const arrStr = result.split(":");
          if (!isNaN(arrStr[0]) && !isNaN(arrStr[1])) {
            const ngay = DateTime.fromJSDate(this.dateTime).toFormat("dd/MM/yyyy");
            const giay =
              this.dateTime.getSeconds() < 10
                ? "0" + this.dateTime.getSeconds().toString()
                : this.dateTime.getSeconds().toString();
            const ngaygio = DateTime.fromFormat(ngay + " " + result + ":" + giay, "dd/MM/yyyy HH:mm:ss");
            if (ngaygio.isValid) {
              this.control.setValue(ngaygio.toJSDate());
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
      this.value = obj.toBSON();
      //this.value = new Date(obj);
    } else if (this.isWriteValue) {
      this._inputDateValue.setValue(undefined);
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

  disabledDates = (current: Date): boolean => {
    let checkMinDate = false;
    if (this.minDate) {
      checkMinDate = checkMinDate || differenceInCalendarDays(current, this.minDate) < 0;
    }
    if (this.maxDate) {
      checkMinDate = checkMinDate || differenceInCalendarDays(current, this.maxDate) > 0;
    }
    return checkMinDate;
  };

  //#endregion
}
