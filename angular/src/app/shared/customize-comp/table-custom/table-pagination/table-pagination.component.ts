import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import * as _ from "lodash";

import { AppUtilityService } from "../../../../../shared/common/custom/utility.service";

@Component({
  selector: "table-pagination",
  templateUrl: "./table-pagination.component.html",
})
export class TablePaginationComponent implements OnInit, OnChanges {
  @Input() check: any;
  @Input() pageIndex = 1;
  @Output() pageIndexChange = new EventEmitter();
  @Input() pageSize = 20;
  @Output() pageSizeChange = new EventEmitter();
  @Input() totalCount = 0;
  @Input() pageSizeOptions: number[] = [10];
  @Output() refreshData = new EventEmitter();
  @Input() tableSize: 'default' | 'sm' | 'md' = 'default';
  checkScreen = window.innerWidth;
  listPageSizeOptionsSelect: {
    value: number;
    display: string;
  }[] = [];
  pageIdxBackUp = 1;
  isMustUpdateWhenFocusOutInput = false;
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pageIndex) {
      if (this.isMustUpdateWhenFocusOutInput === false) {
        this.pageIdxBackUp = changes.pageIndex.currentValue;
      }
    }
  }

  ngOnInit() {}
  getlistPageSizeOptionsSelect() {
    let isPageIdxCurrentInLstOption = false;
    _.forEach(this.pageSizeOptions, (it) => {
      if (isPageIdxCurrentInLstOption === false && it >= this.pageSize) {
        isPageIdxCurrentInLstOption = true;
        this.listPageSizeOptionsSelect.push({
          value: this.pageSize,
          display: this.pageSize.toString()
        });
        if (it === this.pageSize) {
          return;
        }
      }
      this.listPageSizeOptionsSelect.push({
        value: it,
        display: it.toString() 
      });
    });
    if (isPageIdxCurrentInLstOption === false) {
      this.listPageSizeOptionsSelect.push({
        value: this.pageSize,
        display: this.pageSize.toString()
      });
    }
  }

  pageIndexEnter() {
    if (AppUtilityService.isNullOrEmpty(this.pageIndex)) {
      this.pageIndex = 1;
      this.emitPageIndex();
      return;
    }
    if (this.pageIndex <= 0) {
      this.pageIndex = 1;
      this.emitPageIndex();
      return;
    }
    const maxPage = this.getTotalPage();
    if (this.pageIndex > maxPage) {
      this.pageIndex = maxPage;
    }
    this.emitPageIndex();
  }

  emitPageIndex() {
    this.pageIndexChange.emit(this.pageIndex);
    this.pageIdxBackUp = this.pageIndex;
    this.isMustUpdateWhenFocusOutInput = false;
  }

  onChangePageSize() {
    this.pageSizeChange.emit(this.pageSize);
  }

  getTotalPage(): number {
    if (AppUtilityService.isNullOrEmpty(this.totalCount) || this.totalCount === 0) {
      return 0;
    }
    const p = Math.floor(this.totalCount / this.pageSize);
    const du = this.totalCount % this.pageSize;
    if (du === 0) {
      return p;
    }
    //const pageFormat =AppUtilityService.formatCurrency(this.totalCount)
    return p + 1;
  }

  disableBackBtn() {
    return AppUtilityService.isNullOrEmpty(this.pageIndex) || this.pageIndex === 1;
  }

  disableNextBtn() {
    const maxPage = this.getTotalPage();
    return AppUtilityService.isNullOrEmpty(this.pageIndex) || this.pageIndex >= maxPage;
  }

  trangDauClick() {
    this.pageIndex = 1;
    this.emitPageIndex();

  }

  trangTruocClick() {
    this.pageIndex = +this.pageIndex - 1;
    this.emitPageIndex();
  }

  trangSauClick() {
    this.pageIndex = +this.pageIndex + 1;
    this.emitPageIndex();
  }

  trangCuoiClick() {
    this.pageIndex = this.getTotalPage();
    this.emitPageIndex();
  }

  getDangXemTxt() {
    const skip = (this.pageIdxBackUp - 1) * this.pageSize;
    const max = (skip + this.pageSize);
    return `Hiển thị ${(max > this.totalCount) ? this.totalCount : max} / ${AppUtilityService.formatCurrency(this.totalCount)} bản ghi`;
  }

  keyDownInputPageIndex(event) {
    if (event.keyCode === 38 && this.pageIndex < this.getTotalPage()) {
      this.pageIndex = +this.pageIndex + 1;
    }
    if (event.keyCode === 40 && this.pageIndex > 1) {
      this.pageIndex = +this.pageIndex - 1;
    }
    this.isMustUpdateWhenFocusOutInput = true;
  }

  onFocusOutPageIndexInput() {
    if (this.isMustUpdateWhenFocusOutInput === true) {
      this.pageIndex = this.pageIdxBackUp;
    }
  }
}
