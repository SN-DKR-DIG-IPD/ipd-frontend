import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 100;
  pages: number[] = [];
  totalPages = 0;
  startIndex = 0;
  endIndex = 0;
  showEllipsis = false;

  ngOnInit() {
    this.itemsPerPage = +this.itemsPerPage || 10;
    this.currentPage = 1;
    this.calculatePagination();
    this.updateDisplayedRange();
  }


  calculatePagination() {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    const visiblePages = [];
    const maxVisible = 3;

    for (let i = 1; i <= Math.min(maxVisible, this.totalPages); i++) {
      visiblePages.push(i);
    }

    this.pages = visiblePages;
    this.showEllipsis = this.totalPages > maxVisible;
  }

  updateDisplayedRange() {
    this.startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
    this.endIndex = Math.min(this.startIndex + this.itemsPerPage - 1, this.totalItems);
  }

  gotoPage(page: number) {
    this.currentPage = page;
    this.updateDisplayedRange();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedRange();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedRange();
    }
  }

  onItemsPerPageChange() {
    this.itemsPerPage = +this.itemsPerPage;
    this.currentPage = 1;
    this.calculatePagination();
    this.updateDisplayedRange();
  }
}
