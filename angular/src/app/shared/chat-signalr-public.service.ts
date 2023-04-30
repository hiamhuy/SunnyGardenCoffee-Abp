import { Injectable, Injector, NgZone } from "@angular/core";
import * as signalR from "@microsoft/signalr";
// @Injectable()
@Injectable({
    providedIn: "root",
})
export class ChatSignalrPublicService {
    constructor(injector: Injector, public _zone: NgZone) {
        //super(injector);
    }
    isChatConnected = false;
    hubConnection: signalR.HubConnection;

    startConnection = () => {
        // this.hubConnection = new signalR.HubConnectionBuilder()
        //     .withUrl("https://localhost:44312/signalr-public-myChatHub", {
        //         skipNegotiation: true,
        //         transport: signalR.HttpTransportType.WebSockets,
        //     })
        //     .build();
        // this.hubConnection
        //     .start()
        //     .then(() => {
        //         console.log("Hub Connection Started!");
        //     })
        //     .catch((err) => console.log("Error while starting connection: " + err));
    };

    askServer() {
        // this.hubConnection.invoke("SendMessage", "hi").catch((err) => console.error(err));
    }

    askServerListener() {
        // this.hubConnection.on("notificationOrder", (someText) => {});
    }
    // configureConnection(connection): void {
    //     // Set the common hub
    //     this.hubConnection = connection;

    //     // Reconnect loop
    //     let reconnectTime = 5000;
    //     let tries = 1;
    //     let maxTries = 8;
    //     function start() {
    //         return new Promise(function (resolve, reject) {
    //             if (tries > maxTries) {
    //                 reject();
    //             } else {
    //                 connection
    //                     .start()
    //                     .then(resolve)
    //                     .then(() => {
    //                         reconnectTime = 5000;
    //                         tries = 1;
    //                     })
    //                     .catch(() => {
    //                         setTimeout(() => {
    //                             start().then(resolve);
    //                         }, reconnectTime);
    //                         reconnectTime *= 2;
    //                         tries += 1;
    //                     });
    //             }
    //         });
    //     }

    //     // Reconnect if hub disconnects
    //     connection.onclose((e) => {
    //         this.isChatConnected = false;

    //         if (e) {
    //             abp.log.debug("Chat connection closed with error: " + e);
    //         } else {
    //             abp.log.debug("Chat disconnected");
    //         }

    //         start().then(() => {
    //             this.isChatConnected = true;
    //         });
    //     });

    //     // Register to get notifications
    //     this.registerChatEvents(connection);
    // }

    // registerChatEvents(connection): void {
    //     connection.on("notificationOrder", (message) => {
    //         abp.event.trigger("app.notificationOrder", message);
    //     });
    // }

    // sendMessage(messageData, callback): void {
    //     if (!this.isChatConnected) {
    //         if (callback) {
    //             callback();
    //         }

    //         return;
    //     }

    //     this.hubConnection
    //         .invoke("sendMessage", messageData)
    //         .then((result) => {
    //             if (result) {
    //                 abp.notify.warn(result);
    //             }

    //             if (callback) {
    //                 callback();
    //             }
    //         })
    //         .catch((error) => {
    //             abp.log.error(error);

    //             if (callback) {
    //                 callback();
    //             }
    //         });
    // }

    // init(): void {
    //     this._zone.runOutsideAngular(() => {
    //         abp.signalr.connect();
    //         abp.signalr
    //             .startConnection(abp.appPath + "signalr-myChatHub", (connection) => {
    //                 this.configureConnection(connection);
    //             })
    //             .then(() => {
    //                 abp.event.trigger("app.chat.connected");
    //                 this.isChatConnected = true;
    //             });
    //     });
    // }
}
