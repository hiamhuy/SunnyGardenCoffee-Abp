import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
    selector: "input-price",
    templateUrl: "./input-price.component.html",
    styleUrls: ["./input-price.component.scss"],
})
export class InputPriceComponent implements OnInit {
    @Input() value: any;
    @Input() disabled: boolean = false;
    @Output() valueOutput: EventEmitter<any> = new EventEmitter();
    constructor() {}

    ngOnInit() {}
}
