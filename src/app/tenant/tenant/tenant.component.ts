import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, PageEvent } from '@angular/material';
import { TenantAdvanceSearchComponent } from '@gmrc/shared';
import { Router } from '@angular/router';
import { TenantService, ObjectService, LocalStorageService } from '@gmrc/services';
import { PageRequest, Tenant, PageData } from '@gmrc/models';
import { FormControl } from '@angular/forms';
import { FilterType } from '@gmrc/enums';

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.scss']
})
export class TenantComponent implements OnInit {
  dataSource = new MatTableDataSource<Tenant>();
  totalCount: number;
  displayedColumns: string[] = [
    'roomNumber',
    'dueRentDate',
    'firstname',
    'middlename',
    'lastname',
    'gender',
    'typeOfNetWork',
    'action'
  ];
  pageSizeOptions: number[] = [10, 20, 30, 40];
  name = new FormControl('');
  isLoading = true;
  pageRequest = new PageRequest(1, this.pageSizeOptions[0]);
  tenants: Tenant[] = [];
  tenantObjectId: string = null;
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private tenantService: TenantService,
    private objectService: ObjectService,
    private localStorageService: LocalStorageService,
    ) { }

  ngOnInit() {
    this.pageRequest.filters.type = FilterType.ALLTENANTS;
    this.getTenants();
  }
  getTenants(): void {
    this.tenantService.getTenants<Tenant>(this.pageRequest)
      .then( tenants => {
        this.totalCount = tenants.totalCount;
        this.dataSource.data = tenants.data as Tenant[];
        this.isLoading = false;
      })
      .catch( err => {
      });
  }
  searchTenantNameFieldInput(inputTenantName: string): void {
    this.pageRequest.filters.tenantName = this.name.value;
    this.pageRequest.filters.type = FilterType.TENANTBYKEYSTROKE;
    this.tenantService.getTenants<Tenant>(this.pageRequest).then( tenant => {
        this.tenants = tenant.data;
     })
     .catch( err => {
     });
    }
  onSearch(): void {
    if (this.name.value.length !== 0 && this.tenantObjectId !== null) {
      this.pageRequest.filters.type = FilterType.TENANTBYOBJECTID;
      this.pageRequest.filters.tenantObjectId = this.tenantObjectId;
      this.getTenants();
    }
  }
  onAdvanceSearch(): void {
    const dialogRef = this.dialog.open(
      TenantAdvanceSearchComponent,
      {}
    );
    dialogRef.afterClosed().subscribe(searchResult => {
      if (searchResult) {
        this.pageRequest.filters.type = FilterType.ADVANCESEARCHTENANT;
        this.pageRequest.filters.tenantFilter = this.objectService.removeNullValuesInSearchResult(searchResult);
        this.getTenants();
      }
    });
  }
  onPaginatorUpdate($event: PageEvent): void {
    this.pageRequest.page = $event.pageIndex + 1;
    this.pageRequest.limit = $event.pageSize;
    this.getTenants();
  }
  addTenant(): void {
   this.router.navigate(['tenant/add']);
  }
 updateTenant(tenantId: string): void {
   this.router.navigate([`tenant/update/${tenantId}`]);
 }
 displayAllTenants(): void {
    this.pageRequest.filters = { type: FilterType.ALLTENANTS };
    this.getTenants();
 }
}
