import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as $ from 'jquery';

@Injectable()
export class AppUtilityService {
    constructor() { }

    //getWidthMobile(250, null)
    static getWidthMobile(widthMobile: number, widthDeskop?: number) {
        //let screen = $(document).width();
        let screen = window.innerWidth;
        //if (screen <= 1280) {
        if (screen <= 1280) {
            return widthMobile;
        }
        return widthDeskop;
    }

    //getHeightMobile('600px', 'calc(100vh - 390px)')
    static getHeightMobile(heightMobile: any, heightDeskop?: any) {
        //let screen = $(document).width();
        let screen = window.innerHeight;
        //if (screen <= 1280) {
        if (screen <= 800) {
            return heightMobile;
        }
        return heightDeskop;
    }

    static removeDau(str: string): string {
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, ' ');
        str = str.replace(/ + /g, ' ');
        str = str.trim();
        return str;
    }

    static isNotNull(input: any): boolean {
        return !this.isNullOrEmpty(input);
    }

    static isWhitespace(value: string): boolean {
        return (value || '').trim().length === 0;
    }

    static IsNullValidateForm = function (_htmlId: string) {
        if (this.isNullOrEmpty(_htmlId)) {
            return true;
        }
        const _listElement = document.getElementById(_htmlId).querySelectorAll('.custom-error-validate') as NodeListOf<HTMLElement>;
        if (_listElement != null && _listElement.length > 0) {
            _listElement.forEach((_element) => {
                _element.style.display = 'inline';
            });
            return true;
        } else {
            return false;
        }
    };

    static searchVietTat(str) {
        if (this.isNullOrEmpty(str)) {
            return str;
        }
        let ret = '';
        const spl = str.split(' ');
        if (this.isNotAnyItem(spl) === false) {
            spl.forEach((s) => {
                if (s.length > 0) {
                    ret = ret + s[0];
                }
            });
        }
        return this.getFullTextSearch(_.cloneDeep(ret));
    }

    static removeAllSpace(str: string): string {
        if (this.isNullOrEmpty(str)) {
            return str;
        }

        return str.replace(/\s/g, '');
    }

    static removeDauUrl(str: string): string {
        if (this.isNullOrEmpty(str)) {
            return str;
        }
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');
        str = str.replace(/–|!|@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\'| |\"|\&|\#|\[|\]|~/g, '-');
        str = str.replace(/-+-/g, '-');
        str = str.replace(/^\-+|\-+$/g, '');
        str = str.trim();
        return str;
    }

    static getFullTextSearch(str) {
        if (this.isNullOrEmpty(str)) {
            return str;
        }
        str += '';
        str = this.removeDau(str);
        str = str.replace(/ /g, '');
        return str;
    }

    static removeAccents(str) {
        let AccentsMap = [
            'aàảãáạăằẳẵắặâầẩẫấậ',
            'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
            'dđ',
            'DĐ',
            'eèẻẽéẹêềểễếệ',
            'EÈẺẼÉẸÊỀỂỄẾỆ',
            'iìỉĩíị',
            'IÌỈĨÍỊ',
            'oòỏõóọôồổỗốộơờởỡớợ',
            'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
            'uùủũúụưừửữứự',
            'UÙỦŨÚỤƯỪỬỮỨỰ',
            'yỳỷỹýỵ',
            'YỲỶỸÝỴ',
        ];
        for (let i = 0; i < AccentsMap.length; i++) {
            let re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
            let char = AccentsMap[i][0];
            str = str.replace(re, char);
        }
        return str;
    }

    static isNullOrEmpty(input: any): boolean {
        return !(typeof input !== 'undefined' && input && input !== '');
    }

    static isNullOrWhiteSpace(input: any) {
        if (typeof input === 'undefined' || input == null || input == 'null') {
            return true;
        }
        if (typeof input == 'object') {
            return typeof input === 'undefined' || input === null || input === '';
        }
        if (typeof input == 'string') {
            return input.replace(/\s/g, '').length < 1;
        }
    }
    static validateEmail(email) {
        const re =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    static validateNumber = (number) => {
        const re = /^[0-9]{1,10}$/;
        return re.test(String(number).toLowerCase());
    };

    static validateMoment = (_dateTime) => {
        return _dateTime.isValid();
    };

    static isNotAnyItem(input): boolean {
        return this.isNullOrEmpty(input) || input.length === 0;
    }

    static compareDatetime = (_dateTime1, _dateTime2, isFullHour) => {
        if (_dateTime1 && _dateTime2) {
            let date1 =new Date(_dateTime1);
            let date2 =new Date(_dateTime2);
            if (!isFullHour) {
                date1 = AppUtilityService.setDefaultDatetime(new Date(_dateTime1));
                date2 = AppUtilityService.setDefaultDatetime(new Date(_dateTime2));
            }

            if (date1 instanceof Date && date2 instanceof Date) {
                const time = date1.getTime() - date2.getTime();
                return time;
            }

        }
    };

    static setDefaultDatetime(_dateTime) {
        _dateTime.setHours(0, 0, 0, 0);
        return _dateTime;
    }

    static validatePassword(value: string) {
        const check = value.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
        //const check = value.match(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z]).{8,}$/);
        return !!check;
    }

    static validateNumberPhone(value: string) {
        const check = value.match(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g);
        return !!check;
    }

    static formatCurrency(value) {
        try {
            const num = Number(value.toString().replace(/[^0-9.-]+/g, ''));
            //var numRound = num.toFixed(appSession.setting.SoChuSoThapPhan);
            const numRound = num.toFixed(0);
            const parts = numRound.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return parts.join('.');
        } catch (err) {
            return '0';
        }
    }

    // chuyển giá trị số --> string để truyền vào form select
    static convertIntToStringPropertyOfObject(obj): void {
        if (this.isNullOrEmpty(obj)) {
            return;
        }
        if (Array.isArray(obj)) {
            if (this.isNotAnyItem(obj)) {
                return;
            }
            obj.forEach((it) => {
                this.convertIntToStringPropertyOfObject(it);
            });
        } else {
            Object.keys(obj).forEach((key) => {
                const typeKey = typeof obj[key];
                if (typeKey === 'number') {
                    obj[key] = '' + obj[key];
                } else if (typeKey === 'object') {
                    this.convertIntToStringPropertyOfObject(obj[key]);
                }
            });
        }
    }

    static isVisibleJquery(id: string) {
        return $('#' + id).is(':visible');
    }

    // static convertBase64ToBlob(base64, type = MimeTypeNames.ApplicationPdf) {
    //     // Decode base64 using atob method
    //     var raw = window.atob(base64);
    //     // Create an array to store the decoded data
    //     var uInt8Array = new Uint8Array(raw.length);
    //     // blob can only receive binary encoding, need to talk about base64 converted to binary and then stuffed
    //     for (var i = 0; i < raw.length; ++i) {
    //         uInt8Array[i] = raw.charCodeAt(i);
    //     }
    //     // A return value is given here. In other methods, you can get the converted blob by using the base64 encoding.

    //     const blob = new Blob([uInt8Array], { type: type });

    //     return blob;
    // }

    // static downloadFileBase64(base64, type = MimeTypeNames.ApplicationPdf, nameFile = 'fileDownloadDefault') {

    //     const blob = this.convertBase64ToBlob(base64, type);
    //     var link = document.createElement('a');
    //     link.href = window.URL.createObjectURL(blob);
    //     var fileName = nameFile;
    //     link.download = fileName;
    //     link.click();
    //     //window.open(URL.createObjectURL(blob), '_blank');
    // }

    static getAlphabetByIndex(idx: number) {
        const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        return arr[idx];
    }

    static getContentType(type: string) {
        const videos = ['.vob', '.ogv', '.gifv', '.webm', '.mpg', '.mp2', '.mpeg', '.mpe', '.mpv', '.ogg', '.mp4', '.m4p', '.m4v',
            '.avi', '.wmv', '.mov', '.qt', '.flv', '.swf', '.3gp', '.mkv'];
        const images = ['.jpg', '.jpeg', '.jpe', '.jif', '.jfif', '.jfi', '.gif', '.bmp', '.png', '.psd'];
        const sounds = ['.mp3', '.m4a', '.aac', '.oga', '.ogg'];
        const docs = ['.doc', '.dot', '.wbk', '.docx', '.dotm', '.docb', '.pdf', '.wll', '.wwl', '.xls', '.xlt', '.xlm', '.xll'
            , '.xlsx', '.xlsm', '.xltx', '.xltm', '.xlsb', '.xla', '.xlam', '.ppt', '.pot', '.pps', '.ppa', '.ppam', '.pptx', '.pptm'
            , '.potx', '.potm', '.ppam', '.ppsx', '.ppsm', '.sldx', '.sldm', '.pa'];
        let checkType = images.find(m => m == type);
        if (checkType) {
            return 1;
        }
        checkType = sounds.find(m => m == type);
        if (checkType) {
            return 2;
        }
        checkType = videos.find(m => m == type);
        if (checkType) {
            return 3;
        }
        checkType = docs.find(m => m == type);
        if (checkType) {
            return 5;
        }
        return null;
    }

    static convertHtmlToText(html) {
        if (html) {
            html = html.replace(/<style([\s\S]*?)<\/style>/gi, '');
            html = html.replace(/<script([\s\S]*?)<\/script>/gi, '');
            html = html.replace(/<\/div>/ig, '\n');
            html = html.replace(/<\/li>/ig, '\n');
            html = html.replace(/<li>/ig, '  *  ');
            html = html.replace(/<\/ul>/ig, '\n');
            html = html.replace(/<\/p>/ig, '\n');
            html = html.replace(/<br\s*[\/]?>/gi, "\n");
            html = html.replace(/<[^>]+>/ig, '');

            return html;
        }
        return '';
    }

    static roundToTwo(score, num) {
        let value =   (score / num);
        return +(Math.round((value + 'e+2') as any)  + "e-2");
    }


    static shuffleArray(array) {
        let currentIndex = array.length, randomIndex;
        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    }
}
