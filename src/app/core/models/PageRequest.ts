import { Filter } from '@gmrc/models';

export class PageRequest {
  page: number;
  limit: number;
  filters: Filter;
  constructor(page, limit, filters: Filter = {}) {
    this.page = page;
    this.limit = limit;
    this.filters = filters;
  }

}
