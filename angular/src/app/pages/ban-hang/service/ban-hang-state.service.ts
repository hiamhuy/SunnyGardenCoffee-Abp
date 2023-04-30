import { Subject } from "rxjs";
export class BanHangStateService {
    //isReloadStatus$
    isReloadStatus$ = new Subject<boolean>();
    setIsReloadStatus(value: boolean) {
        this.isReloadStatus$.next(value);
    }
}
