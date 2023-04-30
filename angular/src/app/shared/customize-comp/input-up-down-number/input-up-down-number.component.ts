import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";

@Component({
    selector: "input-up-down-number",
    templateUrl: "./input-up-down-number.component.html",
    styleUrls: ["./input-up-down-number.component.scss"],
})
export class InputUpDownNumberComponent extends AppComponentBase implements OnInit, OnChanges {
    @Input() value: number = 0;
    @Output() emitValueNumber: EventEmitter<number> = new EventEmitter();
    constructor(injector: Injector) {
        super(injector);
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            var _value = changes.value.currentValue;
            var _valuePre = changes.value.previousValue;
            if (
                changes.value.firstChange ||
                (!changes.value.firstChange &&
                    _valuePre != _value - 1 &&
                    !changes.value.firstChange &&
                    _valuePre - 1 != _value)
            ) {
                this.emitValueNumber.emit(_value);
            }
        }
    }

    ngOnInit() {}

    down() {
        this.value -= 1;
        if (this.value <= 0) {
            this.value = 0;
        }
        this.emitValueNumber.emit(this.value);
    }
    up() {
        this.value += 1;
        if (this.value >= 100) {
            this.value = 100;
        }
        this.emitValueNumber.emit(this.value);
    }
}
