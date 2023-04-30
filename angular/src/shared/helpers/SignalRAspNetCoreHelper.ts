import { AppConsts } from "@shared/AppConsts";
import { LocalStorageService } from "@shared/session/local-storage.service";
import { UtilsService } from "abp-ng2-module";

export class SignalRHelper {
    static initSignalR(callback?: () => void): void {
        // const encryptedAuthToken = new UtilsService().getCookieValue(AppConsts.authorization.encryptedAuthTokenName);

        // abp.signalr = {
        //     autoConnect: true,
        //     connect: undefined,
        //     hubs: undefined,
        //     qs: AppConsts.authorization.encryptedAuthTokenName + "=" + encodeURIComponent(encryptedAuthToken),
        //     remoteServiceBaseUrl: AppConsts.remoteServiceBaseUrl,
        //     startConnection: undefined,
        //     url: "/signalr",
        // };

        // const script = document.createElement("script");
        // if (callback) {
        //     script.onload = () => {
        //         callback();
        //     };
        // }
        // script.src = AppConsts.appBaseUrl + "/assets/abp/abp.signalr-client.js";
        // document.head.appendChild(script);

        new LocalStorageService().getItem(AppConsts.authorization.encryptedAuthTokenName, function (err, value) {
            let encryptedAuthToken = value?.token;

            abp.signalr = {
                autoConnect: false,
                connect: undefined,
                hubs: undefined,
                qs: encryptedAuthToken
                    ? AppConsts.authorization.encryptedAuthTokenName + "=" + encodeURIComponent(encryptedAuthToken)
                    : "",
                remoteServiceBaseUrl: AppConsts.remoteServiceBaseUrl,
                startConnection: undefined,
                url: "/signalr",
            };

            let script = document.createElement("script");
            script.onload = () => {
                callback();
            };

            script.src = AppConsts.appBaseUrl + "/assets/abp/abp.signalr-client.js";
            document.head.appendChild(script);
        });
    }
}
