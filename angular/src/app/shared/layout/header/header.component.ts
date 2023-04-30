import { Component, ChangeDetectionStrategy, ViewEncapsulation, OnInit, Injector } from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent extends AppComponentBase implements OnInit {
    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {}
}
