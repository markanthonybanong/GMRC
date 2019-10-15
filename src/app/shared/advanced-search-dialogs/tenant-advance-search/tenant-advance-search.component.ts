import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Gender, TypeOfNetwork } from '@gmrc/enums';


@Component({
  selector: 'app-tenant-advance-search',
  templateUrl: './tenant-advance-search.component.html',
  styleUrls: ['./tenant-advance-search.component.scss']
})
export class TenantAdvanceSearchComponent implements OnInit {

  searchFiltersForm = this.formBuilder.group({
    gender: [null],
    typeOfNetwork: [null],
    dueRentDate: [null],
    roomNumber: [null]
  });
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
  }

  get genders(): Array<string> {
    return Object.entries(Gender).map( element => element[1]);
  }

  get networks(): Array<string> {
    return Object.entries(TypeOfNetwork).map( element => element[1]);
  }
}
