import { Component, OnInit } from '@angular/core';
import { RoomEnumService } from '@gmrc/services';
import { FormBuilder } from '@angular/forms';
import { DeckStatus } from '@gmrc/enums';

@Component({
  selector: 'app-bedspace-advance-search',
  templateUrl: './bedspace-advance-search.component.html',
  styleUrls: ['./bedspace-advance-search.component.scss']
})
export class BedspaceAdvanceSearchComponent implements OnInit {
  searchFiltersForm = this.formBuilder.group({
    number: null,
    floor: null,
    deckStatus: null,
    awayDeckStatus: null,
    aircon: null,
  });

  awayDeckStatus = [DeckStatus.AWAY, DeckStatus.OCCUPIED, DeckStatus.VACANT];
  constructor(private roomEnumService: RoomEnumService, private formBuilder: FormBuilder) { }

  ngOnInit() {
  }

}
