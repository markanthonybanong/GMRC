import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RoomEnumService } from '@gmrc/services';

@Component({
  selector: 'app-transient-private-advance-search',
  templateUrl: './transient-private-advance-search.component.html',
  styleUrls: ['./transient-private-advance-search.component.scss']
})
export class TransientPrivateAdvanceSearchComponent implements OnInit {
  roomType: string[] = ['Transient', 'Private'];
  searchFiltersForm = this.formBuilder.group({
    number: null,
    floor: null,
    type: null,
    status: null,
    aircon: null,
    dueRent: null,
  });
  constructor(private formBuilder: FormBuilder, private roomEnumService: RoomEnumService) { }

  ngOnInit() {

  }

}
