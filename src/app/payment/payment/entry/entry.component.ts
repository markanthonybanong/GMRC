import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { PageRequest } from '@gmrc/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enter',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit {
  isLoading = true;
  displayedColumns: string[] = [
    'tenant',
    'roomType',
    'monthlyRent',
    'key',
    'oneMonthDeposit',
    'oneMonthAdvance',
    'actions'
  ];
  pageSizeOptions: number[] = [5, 10, 15];
  pageRequest = new PageRequest(1, this.pageSizeOptions[0]);
  dataSource = new MatTableDataSource<any>();
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.getEntries();
  }
  getEntries(): void {
    this.isLoading = false;
  }
  addEntry(): void {
    this.router.navigate([`payment/add-entry`]);
  }
}
