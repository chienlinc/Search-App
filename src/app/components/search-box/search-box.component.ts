import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search-box',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css',
})
export class SearchBoxComponent {
  searchTerm: string = '';

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    this.searchTerm = this.searchService.getSearchText();
  }

  performSearch(): void {
    if (this.searchTerm.trim()) {
      this.searchService.setSearchText(this.searchTerm);
    }
  }

  onEnterKey(): void {
    this.performSearch();
  }
}
