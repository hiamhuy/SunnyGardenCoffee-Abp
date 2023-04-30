import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";

@Component({
  selector: "input-number",
  templateUrl: "./input-number.component.html",
  styleUrls: ["./input-number.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class InputNumberComponent implements OnInit {
  @ViewChild("inputElement", { static: false }) inputElement?: ElementRef;
  @Input() value = "";
  title = "Nhập số";
  @Output() emitValue = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  onChange(value: string): void {
    this.updateValue(value);
  }

  // '.' at the end or only '-' in the input box.
  // onBlur(): void {
  //   if (
  //     this.value.charAt(this.value.length - 1) === "." ||
  //     this.value === "-"
  //   ) {
  //     this.updateValue(this.value.slice(0, -1));
  //   }
  // }

  updateValue(value: string): void {
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(+value) && reg.test(value)) || value === "" || value === "-") {
      this.value = value;
      this.emitValue.emit(value);
    }
    this.inputElement!.nativeElement.value = this.value;
    this.updateTitle();
  }

  updateTitle(): void {
    this.title =
      (this.value !== "-" ? this.formatNumber(this.value) : "-") ||
      "Chỉ được nhập số !";
  }

  formatNumber(value: string): string {
    const stringValue = `${value}`;
    const list = stringValue.split(".");
    const prefix = list[0].charAt(0) === "-" ? "-" : "";
    let num = prefix ? list[0].slice(1) : list[0];
    let result = "";
    while (num.length > 3) {
      result = `,${num.slice(-3)}${result}`;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    return `${prefix}${result}${list[1] ? `.${list[1]}` : ""}`;
  }
}
