import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";

@Component({
    selector: "input-percen",
    templateUrl: "./input-percen.component.html",
    styleUrls: ["./input-percen.component.scss"],
})
export class InputPercenComponent implements OnInit, OnChanges {
    @Input() value: number = 0;
    @Output() valueOutput: EventEmitter<any> = new EventEmitter();
    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            if (changes.value.currentValue >= 100) {
                let number = 100;
                this.valueOutput.emit(number);
            }
            if (changes.value.currentValue <= 0) {
                let number = 0;
                this.valueOutput.emit(number);
            }
        }
    }

    ngOnInit() {}
}
