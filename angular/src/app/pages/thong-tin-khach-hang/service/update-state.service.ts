import { Subject } from "rxjs";
export class ThongTinKhachHangStateService {
    //isReloadStatus$
    isReloadStatus$ = new Subject<boolean>();
    setIsReloadStatus(value: boolean) {
        this.isReloadStatus$.next(value);
    }
}
