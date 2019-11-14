import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { PageRequest, PageData } from '@gmrc/models';

@Injectable({
  providedIn: 'root'
})
export class BedService {

  constructor(
    private apiService: ApiService
  ) { }
  getBeds<T>(pageRequest: PageRequest = null) {
    return this.apiService.post<PageData<T>>('bed/page', pageRequest);
  }
}
