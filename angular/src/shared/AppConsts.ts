export class AppConsts {
    static remoteServiceBaseUrl: string;
    static appBaseUrl: string;
    static baseService: string = "https://localhost:44311/Photos";
    static appBaseHref: string; // returns angular's base-href parameter value if used during the publish

    static localeMappings: any = [];

    static readonly userManagement = {
        defaultAdminUserName: "admin",
    };

    static readonly localization = {
        defaultLocalizationSourceName: "SunnyGardenCoffee",
    };

    static readonly authorization = {
        encryptedAuthTokenName: "enc_auth_token",
    };

    static readonly grid = {
        defaultPageSize: 10,
        defaultPageSizes: [5, 10, 15, 20, 25, 30, 50, 80, 100],
    };

    static webSiteRootAddress: string;
}
