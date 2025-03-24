import { Component } from '@angular/core';
import { SearchService } from '@services/search.service';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { SearchBoxComponent } from '@components/search-box/search-box.component';
import { BookCardComponent } from '@components/book-card/book-card.component';
import { RouterLink } from '@angular/router';
import { PaginatorComponent } from '@components/paginator/paginator.component';
import { SearchResponse } from '@models/search-response.model';

@Component({
  selector: 'app-search',
  imports: [
    CommonModule,
    RouterLink,
    SearchBoxComponent,
    BookCardComponent,
    PaginatorComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  books$: Observable<SearchResponse>;
  pageIndex = 1;
  searchTerm: string = '';
  pageSize = 10;
  totalResults$: Observable<number>;

  constructor(private searchService: SearchService) {
    this.books$ = this.searchService.getSearchResults();
    this.totalResults$ = this.searchService.getTotalResults();
  }
  private searchSubscription: Subscription | null = null;

  ngOnInit() {
    this.searchSubscription = this.searchService.search$.subscribe((term) => {
      if (!term) {
        return;
      }
      this.searchTerm = term;
    });

    this.searchService.pageIndex$.subscribe((index) => {
      this.pageIndex = index;
    });
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  onPageChange(event: PageEvent) {
    if (this.pageSize !== event.pageSize) {
      this.pageIndex = 1;
    } else {
      this.pageIndex = event.pageIndex + 1;
    }
    this.pageSize = event.pageSize;
    this.searchService.setPageSize(this.pageSize);
    this.searchService.setPageIndex(this.pageIndex);
  }
}
