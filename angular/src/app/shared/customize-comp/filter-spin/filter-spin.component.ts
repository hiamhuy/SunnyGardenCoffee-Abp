import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "filter-spin",
  templateUrl: "./filter-spin.component.html",
  styleUrls: ["./filter-spin.component.scss"],
})
export class FilterSpinComponent implements OnInit {
  keyword = '';
  @Input() isTypeButtonSearch?= false;
  @Input() searchAfterEnter = true;
  @Input() isOnlySearch?= false;
  @Input() isShowTitleSearch?= false;
  @Input() showButtonExpand = true;
  @Input() titleInputSearch?= 'Tìm kiếm';
  @Input() widthColSearch?= 18;
  @Output() onSearch = new EventEmitter();
  @Output() onRefresh = new EventEmitter();

  showAdvancedSearch = false;
  checkScreen = window.innerWidth;
  constructor() {}

  ngOnInit() {}
  
  search() {
    this.onSearch.emit();
}

refresh() {
    this.onRefresh.emit();
}

onEnter() {
    if (this.searchAfterEnter) {
        this.search();
    }
}

clickShowHideAdvancedSearch() {
    this.showAdvancedSearch = !this.showAdvancedSearch;
}

trackByIndex(index: number, el: any): number {
    return index;
}
}
