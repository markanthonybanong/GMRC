import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, PageEvent, MatSort, MatPaginator } from '@angular/material';
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
  pageRequest = new PageRequest(null, null);
  tenants: Tenant[] = [];
  tenantObjectId: string = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
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
  displayPreviousPage(): void {
    const filterType     = this.localStorageService.getItem('tenantFilterType');
    const filter         = this.localStorageService.getItem('tenantFilter');
    const tenantObjectId = this.localStorageService.getItem('tenantObjectId');
    const page           = this.localStorageService.getItem('tenantPage');

    if ( filterType !== null ) {
      this.pageRequest.filters.type = filterType;
    }
    if ( filter !== null ) {
      this.pageRequest.filters.roomPaymentFilter = filter;
    }
    if ( tenantObjectId !== null ) {
      this.pageRequest.filters.tenantObjectId = tenantObjectId;
    }
    if ( page !== null) {
      this.paginator.pageIndex = page;
    }
  }
  getTenants(): void {
    this.displayPreviousPage();
    this.tenantService.getTenants<Tenant>(this.pageRequest)
      .then( tenants => {
        this.totalCount = tenants.totalCount;
        this.dataSource.data = tenants.data as Tenant[];
        this.dataSource.paginator = this.paginator;
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
      this.localStorageService.setItem('tenantFilterType', FilterType.TENANTBYOBJECTID);
      this.localStorageService.setItem('tenantObjectId', this.tenantObjectId);
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
        const filter = this.objectService.removeNullValuesInSearchResult(searchResult);
        this.pageRequest.filters.type = FilterType.ADVANCESEARCHTENANT;
        this.pageRequest.filters.tenantFilter = filter;
        this.localStorageService.setItem('tenantFilterType', FilterType);
        this.localStorageService.setItem('tenantFilter', filter);
        this.getTenants();
      }
    });
  }
  onPaginatorUpdate($event: PageEvent): void {
    this.localStorageService.setItem('tenantPage', $event.pageIndex);
  }
  addTenant(): void {
   this.router.navigate(['tenant/add']);
  }
 updateTenant(tenantId: string): void {
   this.router.navigate([`tenant/update/${tenantId}`]);
 }
 displayAllTenants(): void {
    this.localStorageService.remove('tenantFilterType');
    this.localStorageService.remove('tenantFilter');
    this.localStorageService.remove('tenantObjectId');
    this.localStorageService.remove('tenantPage');
    this.pageRequest.filters = { type: FilterType.ALLTENANTS };
    this.getTenants();
 }
}
