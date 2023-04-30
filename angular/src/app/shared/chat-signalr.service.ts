import { Injectable, Injector, NgZone } from "@angular/core";
import { HubConnection } from "@microsoft/signalr";
// @Injectable()
@Injectable({
    providedIn: "root",
})
export class ChatSignalrService {
    constructor(injector: Injector, public _zone: NgZone) {
        //super(injector);
    }

    chatHub: HubConnection;
    isChatConnected = false;

    configureConnection(connection): void {
        // Set the common hub
        this.chatHub = connection;

        // Reconnect loop
        let reconnectTime = 5000;
        let tries = 1;
        let maxTries = 8;
        function start() {
            return new Promise(function (resolve, reject) {
                if (tries > maxTries) {
                    reject();
                } else {
                    connection
                        .start()
                        .then(resolve)
                        .then(() => {
                            reconnectTime = 5000;
                            tries = 1;
                        })
                        .catch(() => {
                            setTimeout(() => {
                                start().then(resolve);
                            }, reconnectTime);
                            reconnectTime *= 2;
                            tries += 1;
                        });
                }
            });
        }

        // Reconnect if hub disconnects
        connection.onclose((e) => {
            this.isChatConnected = false;

            if (e) {
                abp.log.debug("Chat connection closed with error: " + e);
            } else {
                abp.log.debug("Chat disconnected");
            }

            start().then(() => {
                this.isChatConnected = true;
            });
        });

        // Register to get notifications
        this.registerChatEvents(connection);
    }

    registerChatEvents(connection): void {
        connection.on("notificationOrder", (message) => {
            abp.event.trigger("app.notificationOrder", message);
        });
    }

    sendMessage(messageData, callback): void {
        if (!this.isChatConnected) {
            if (callback) {
                callback();
            }

            return;
        }

        this.chatHub
            .invoke("sendMessage", messageData)
            .then((result) => {
                if (result) {
                    abp.notify.warn(result);
                }

                if (callback) {
                    callback();
                }
            })
            .catch((error) => {
                abp.log.error(error);

                if (callback) {
                    callback();
                }
            });
    }

    init(): void {
        this._zone.runOutsideAngular(() => {
            abp.signalr.connect();
            abp.signalr
                .startConnection(abp.appPath + "signalr-myChatHub", (connection) => {
                    this.configureConnection(connection);
                })
                .then(() => {
                    abp.event.trigger("app.chat.connected");
                    this.isChatConnected = true;
                });
        });
    }
}
