import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { UploadFilesImageServiceProxy, FileParameter } from "@shared/service-proxies/service-proxies";
import { AppConsts } from "@shared/AppConsts";
@Component({
    selector: "upload-image",
    templateUrl: "./upload-image.component.html",
    styleUrls: ["./upload-image.component.scss"],
})
export class UploadImageComponent implements OnInit {
    @ViewChild("imgSrc", { static: true }) imgSrc: ElementRef;
    duongDanAnh: any;
    labelVal: string = "Chọn ảnh";
    @Input() value: string;
    @Output() fileNameOutput: EventEmitter<any> = new EventEmitter();
    constructor(private dataService: UploadFilesImageServiceProxy, private http: HttpClient) {}

    ngOnInit() {
        if (this.value != null) {
            this.duongDanAnh = AppConsts.baseService + "/" + this.value;
        }
    }

    uploadPhoto(event) {
        var file = event.target.files[0];
        var nameValue = file.name;

        let dataInput: FileParameter = {
            data: file,
            fileName: nameValue,
        };
        this.dataService.saveFile(dataInput).subscribe((data) => {
            var anhMonAn = data.toString();
            this.duongDanAnh = AppConsts.baseService + "/" + anhMonAn;
        });

        if (nameValue) {
            this.labelVal = nameValue;
        }
        this.fileNameOutput.emit(nameValue);
    }
}
