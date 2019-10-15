import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RoomEnumService } from '@gmrc/services';

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
  constructor(private formBuilder: FormBuilder, private roomEnumService: RoomEnumService) { }

  ngOnInit() {
  }

}
