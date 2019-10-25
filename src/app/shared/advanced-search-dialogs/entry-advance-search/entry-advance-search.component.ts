import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PageRequest, Room, Tenant } from '@gmrc/models';
import { RoomService, TenantService } from '@gmrc/services';
import { FilterType } from '@gmrc/enums';

@Component({
  selector: 'app-entry-advance-search',
  templateUrl: './entry-advance-search.component.html',
  styleUrls: ['./entry-advance-search.component.scss']
})
export class EntryAdvanceSearchComponent implements OnInit {
  roomNumbers: number[] = [];
  searchFiltersForm = this.formBuilder.group({
    roomNumber: null,
    tenant: null,
    oneMonthDeposit: null,
    oneMonthAdvance: null,
    dateEntry: null,
    dateExit: null,
    tenantObjectId: null,
  });
  pageRequest = new PageRequest(null, null);
  tenants: Tenant[];
  constructor(
    private formBuilder: FormBuilder,
    private roomService: RoomService,
    private tenantService: TenantService,
  ) { }

  ngOnInit() {
    this.getRoomNumbers();
  }
  getRoomNumbers(): void {
    this.pageRequest.filters.type = FilterType.ALLROOMS;
    this.roomService.getRooms<Room>(this.pageRequest).then( rooms => {
      rooms.data.forEach(room => {
        this.roomNumbers.push(room.number);
      });
    })
    .catch( err => {});
  }
  searchTenant(inputTenantName: string): void {
    if (inputTenantName.length !== 0 ) {
      this.pageRequest.filters.tenantName = inputTenantName;
      this.pageRequest.filters.type = FilterType.TENANTBYKEYSTROKE;
      this.tenantService.getTenants<Tenant>(this.pageRequest)
      .then( tenant => {
        this.tenants = tenant.data;
      }).catch( error => {
     });
    }
  }
  patchTenantObjectId(tenantObjectId: string) {
    this.searchFiltersForm.get('tenantObjectId').patchValue(tenantObjectId);
  }

}
