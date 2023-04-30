
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CoreHelperService } from '@shared/helpers/core-helper.service';


@Component({
    selector: 'paging-list-custom',
    templateUrl: './paging-list-custom.component.html',
    styleUrls: ['./paging-list-custom.component.scss'],
})
export class PagingListCustomComponent implements  OnChanges {
    @Input() totalCount = 1;
    @Input() pageSize = 10;
    @Input() page = 1;
    @Input() totalPage = 0;
    @Output() eventChangePaging: EventEmitter<any> = new EventEmitter<any>();
    arrPaging = [];

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.totalCount.currentValue || changes.pageSize.currentValue || changes.page.currentValue) {
            this.totalPage = this.setTotalPage(changes.totalCount.currentValue, this.pageSize);
            this.arrPaging = CoreHelperService.getListPageRange(this.page, this.page + 1, this.totalPage);
        }
    }

    changePaging(page) {
        if (page != '...') {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            if (this.page != page) {
                this.page = page;
                this.eventChangePaging.emit(this.page);
            }

            this.arrPaging = CoreHelperService.getListPageRange(this.page, this.page + 1, this.totalPage);
        }
    }

    setTotalPage = function (totalRecord, pageSize) {
        let totalpage = Math.ceil(totalRecord / pageSize);
        return totalpage;
    }

}
