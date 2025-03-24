import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  combineLatest,
  catchError,
  debounceTime,
  switchMap,
  of,
  tap,
  Observable,
} from 'rxjs';
import { Book } from '@models/book.model';
import { SearchResponse } from '@models/search-response.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly API_URL = 'https://openlibrary.org/search.json';

  private searchText = new BehaviorSubject<string>('');
  private pageSize = new BehaviorSubject<number>(10);
  private pageIndex = new BehaviorSubject<number>(1);
  private totalResults = new BehaviorSubject<number>(0);

  search$ = this.searchText.asObservable();
  pageIndex$ = this.pageIndex.asObservable();

  constructor(private http: HttpClient) {}

  searchBooks(query: string, index: number = 1, size: number = 10) {
    const searchQuery = encodeURIComponent(query.trim());
    return this.http
      .get<SearchResponse>(
        `${this.API_URL}?q=${searchQuery}&page=${index}&limit=${size}`,
      )
      .pipe(catchError(() => of({ docs: [], num_found: 0 })));
  }

  getSearchText(): string {
    return this.searchText.value;
  }

  setSearchText(text: string) {
    if (text !== this.getSearchText()) {
      this.searchText.next(text);
      this.pageIndex.next(1);
    }
  }

  setPageIndex(index: number) {
    this.pageIndex.next(index);
  }

  setPageSize(size: number) {
    this.pageSize.next(size);
  }

  getTotalResults(): Observable<number> {
    return this.totalResults.asObservable();
  }

  getSearchResults(): Observable<SearchResponse> {
    return combineLatest([
      this.searchText.pipe(debounceTime(300)),
      this.pageIndex.pipe(debounceTime(300)),
    ]).pipe(
      switchMap(([text, pageIndex]) =>
        this.searchBooks(text, pageIndex, this.pageSize.value).pipe(
          tap((response) => {
            const typedResponse = response as {
              docs: Book[];
              num_found: number;
            };
            this.totalResults.next(typedResponse.num_found || 0);
          }),
        ),
      ),
    );
  }
}
