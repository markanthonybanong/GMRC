import { Injectable } from '@angular/core';
import { Tenant, PageRequest, PageData } from '@gmrc/models';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  constructor(private apiService: ApiService) { }
  addTenant(body: Tenant) {
   return this.apiService.post<Tenant>('tenant/', body);
  }
  updateTenant(body: Tenant) {
    return this.apiService.put<Tenant>(`tenant/${body._id}`, body);
  }
  getTenants<T>(pageRequest: PageRequest) {
    return this.apiService.post<PageData<T>>('tenant/page', pageRequest);
  }
}
