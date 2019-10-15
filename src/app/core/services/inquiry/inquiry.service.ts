import { Injectable } from '@angular/core';
import { Inquiry, PageRequest, PageData } from '@gmrc/models';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class InquiryService {
  constructor(private apiService: ApiService) { }
  addInquiry(body: Inquiry) {
   return this.apiService.post<Inquiry>('inquiry/', body);
  }
  updateInquiry(body: Inquiry) {
    return this.apiService.put<Inquiry>(`inquiry/${body._id}`, body);
  }
  getInquiries<T>(pageRequest: PageRequest) {
    return this.apiService.post<PageData<T>>('inquiry/page', pageRequest);
  }
  removeInquiry(inquiryObjectId: string) {
    return this.apiService.delete<Inquiry>(`inquiry/remove/${inquiryObjectId}`);
  }
}
