import { Component, Injector, NgZone, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ThongTinKhachHangStateService } from "@app/pages/thong-tin-khach-hang/service/update-state.service";
import { ChatSignalrPublicService } from "@app/shared/chat-signalr-public.service";
import * as signalR from "@microsoft/signalr";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from "@shared/common/app-component-base";
import {
    KhachHangDto,
    ThongBaoAppServicesServiceProxy,
    TrangThaiMuaHang,
} from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { ShowBillComponent } from "./show-bill/show-bill.component";

@Component({
    selector: "notification-bell",
    templateUrl: "./notification-bell.component.html",
    styleUrls: ["./notification-bell.component.scss"],
    animations: [appModuleAnimation()],
})
export class NotificationBellComponent extends AppComponentBase implements OnInit {
    isShowBoxNotification: boolean = false;
    count: number = 0;
    listItem: KhachHangDto[] = [];
    TrangThaiMuaHang = TrangThaiMuaHang;

    hubConnection: signalR.HubConnection;
    constructor(
        injector: Injector,
        private router: Router,
        private dataServiece: ThongBaoAppServicesServiceProxy,
        private ser: ThongTinKhachHangStateService,
        private signalr: ChatSignalrPublicService
    ) {
        super(injector);
    }

    ngOnInit() {
        this.getDataNotifi();
        this.callSignalR();
        this.ser.isReloadStatus$.subscribe((result) => {
            if (result) {
                this.getDataNotifi();
            }
        });
    }

    getDataNotifi() {
        this.dataServiece
            .getListKhachHang()
            .pipe(
                finalize(() => {
                    abp.ui.clearBusy();
                })
            )
            .subscribe((result) => {
                if (result) {
                    this.listItem = result;
                    this.count = this.listItem.filter((x) => x.status == TrangThaiMuaHang.DaDat).length;
                }
            });
    }

    callSignalR() {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:44312/signalr-public-myChatHub", {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets,
            })
            .build();
        this.hubConnection
            .start()
            .then(() => {
                console.log("Connected to SignalR server!");
            })
            .catch((err) => console.log("Error while starting connection: " + err));

        setTimeout(() => {
            this.hubConnection.on("notificationOrder", (someText) => {
                this.getDataNotifi();
            });
            this.hubConnection.invoke("SendMessage", "hi").catch((err) => console.error(err));
        }, 2000);
    }

    showBox() {
        if (this.isShowBoxNotification == false) {
            this.isShowBoxNotification = true;
        } else {
            this.isShowBoxNotification = false;
        }
    }

    clickedOutside() {
        this.isShowBoxNotification = false;
    }

    showBill(item: KhachHangDto) {
        let sTitle = "Đơn hàng " + item.phoneNumber;
        const modal = this.modalService.create({
            nzTitle: sTitle,
            nzContent: ShowBillComponent,
            nzComponentParams: {
                data: item,
            },
            nzFooter: null,
            nzWidth: "40%",
        });

        modal.afterClose.subscribe((result) => {
            if (result) {
                this.getDataNotifi();
            }
        });
    }

    quanLyDonHang() {
        this.router.navigate([`app/quan-ly/thong-tin-khach-hang`]);
    }
}
