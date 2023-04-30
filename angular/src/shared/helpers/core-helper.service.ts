import { Injectable } from '@angular/core';
import { Observable, of } from '@node_modules/rxjs';
import { filter, map } from '@node_modules/rxjs/operators';

export interface ISelectOption {
    value: string;
    displayText: string;
    fts?: string;
    isActive?: boolean;
    data?: any;
}

@Injectable({
    providedIn: 'root'
})

export class CoreHelperService {
  

    private constructor() {
    }

   
    // getDisplayTextForPipe(option$: Observable<ISelectOption[]>, value): Observable<string> {
    //     return option$.pipe(
    //         filter(s => {
    //             return s && s?.length > 0;
    //         }),
    //         map(lst => {
    //             const f = lst.find(x => '' + x.value === '' + value);
    //             return f?.displayText;
    //         })
    //     );
    // }

    public static getListPageRange = ((activePage, pageNeighbours, totalPages) => {
        let range = [];
        if (totalPages > 7) {
            for (let page = 1; page <= totalPages; page++) {
                if (pageNeighbours > 5) {
                    if (page == 2 || ((page == totalPages - 1) && totalPages - activePage > 4)) {
                        range.push('...');
                    }
                    else if ((page == 1 || (activePage - 2) <= page && page <= (activePage + 2) && page < totalPages)) {
                        range.push(page);
                    }
                }
                else {
                    if (totalPages > 7) {
                        if (page < 6)
                            range.push(page);
                        else {
                            range.push('...');
                            break;
                        }
                    }
                }
            }
            range.push(totalPages);
        }
        else {
            for (let page = 1; page <= totalPages; page++)
                range.push(page);
        }

        return range;
    });

    // static removeSession(enumName?: number, cascaderId?: any, fullKey?: string) {
    //     const key = fullKey ? fullKey : ('combo-data-' + enumName + cascaderId);
    //     sessionStorage.removeItem(key);
    // }
    // notifyErrorInValidForm() {
    //     abp.notify.error('formNotValid.message', 'formNotValid.title');
    // }


    // getYearFilterOptions() {
    //     const options: ISelectOption[] = [];
    //     const currentYear = (new Date()).getFullYear();
    //     for (let y = currentYear; y > 2000; y--) {
    //         options.push({
    //             value: y + '',
    //             displayText: 'Năm ' + y
    //         });
    //     }
    //     return options;
    // }

    // cutString(str, maxLength) {
    //     if (str && str.length > maxLength) {
    //         str = str.slice(0, maxLength) + "...";
    //     }
    //     return str;
    // }

    // static startTimer(duration, display) {
    //     var start = Date.now(),
    //         diff,
    //         minutes,
    //         seconds;
    //     function timer() {
    //         // get the number of seconds that have elapsed since
    //         // startTimer() was called
    //         diff = duration - (((Date.now() - start) / 1000) | 0);

    //         // does the same job as parseInt truncates the float
    //         minutes = (diff / 60) | 0;
    //         seconds = (diff % 60) | 0;

    //         minutes = minutes < 10 ? "0" + minutes : minutes;
    //         seconds = seconds < 10 ? "0" + seconds : seconds;

    //         display = minutes + ":" + seconds;

    //         if (diff <= 0) {
    //             // add one second so that the count down starts at the full duration
    //             // example 05:00 not 04:59
    //             start = Date.now() + 1000;
    //         }
    //     };
    //     // we don't want to wait a full second before the timer starts
    //     timer();
    //     setInterval(timer, 1000);
    // }

    // window.onload = function () {
    //     var fiveMinutes = 60 * 5,
    //         display = document.querySelector('#time');
    //     startTimer(fiveMinutes, display);
    // };
}

