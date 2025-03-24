import { Book } from '@models/book.model';

export interface SearchResponse {
  docs: Book[];
  num_found: number;
}
