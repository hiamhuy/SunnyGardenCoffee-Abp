import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "splitVND",
})
export class ShiftPosition implements PipeTransform {
    transform(items: any[], value: string): string {
        if (items) {
            return items.slice(3) + " " + items.slice(0, 3);
        } else if (value) {
            return value.slice(3) + " " + value.slice(0, 3);
        } else {
            return;
        }
    }
}
