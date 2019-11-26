import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Tenant, PageRequest, Room } from '@gmrc/models';
import { RoomService, TenantService } from '@gmrc/services';
import { FilterType } from '@gmrc/enums';

@Component({
  selector: 'app-penalty-advance-search',
  templateUrl: './penalty-advance-search.component.html',
  styleUrls: ['./penalty-advance-search.component.scss']
})
export class PenaltyAdvanceSearchComponent implements OnInit {
  searchFiltersForm = this.formBuilder.group({
    roomNumber: null,
    date: null,
    tenantName: null,
    tenant: null,
  });
  roomNumbers: Array<number> = [];
  tenants: Array<Tenant> = [];
  pageRequest = new PageRequest(null, null);
  constructor(
    private formBuilder: FormBuilder,
    private roomService: RoomService,
    private tenantService: TenantService
  ) { }

  ngOnInit() {
    this.getRoomNumbers();
  }
  async getRoomNumbers(): Promise<void> {
    try {
      this.pageRequest.filters.type = FilterType.ALLROOMS;
      const rooms = await this.roomService.getRooms<Room>(this.pageRequest);
      rooms.data.forEach(room => {
        this.roomNumbers.push(room.number);
      });
    } catch (error) {}
  }
  async searchTenant(inputTenantName: string): Promise<void> {
    if (inputTenantName.length !== 0 ) {
      try {
        this.pageRequest.filters.tenantName = inputTenantName;
        this.pageRequest.filters.type       = FilterType.TENANTBYKEYSTROKE;
        const tenants                       = await this.tenantService.getTenants<Tenant>(this.pageRequest);
        this.tenants                        = tenants.data;
      } catch (error) {}
    }
  }
  patchTenantObjectId(tenantObjectId: string): void {
    this.searchFiltersForm.get('tenant').setValue(tenantObjectId);
  }

}
