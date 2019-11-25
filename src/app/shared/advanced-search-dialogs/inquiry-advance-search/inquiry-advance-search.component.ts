import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RoomEnumService, RoomService, TenantService } from '@gmrc/services';
import { PageRequest, Room, Tenant } from '@gmrc/models';
import { FilterType } from '@gmrc/enums';

@Component({
  selector: 'app-inquiry-advance-search',
  templateUrl: './inquiry-advance-search.component.html',
  styleUrls: ['./inquiry-advance-search.component.scss']
})
export class InquiryAdvanceSearchComponent implements OnInit {
  searchFiltersForm = this.formBuilder.group({
    roomType: null,
    roomNumber: null,
    willOccupyIn: null,
  });
  pageRequest = new PageRequest(null, null);
  roomNumbers: Array<number> = [];

  constructor(
    private formBuilder: FormBuilder,
    private roomEnumService: RoomEnumService,
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

}
