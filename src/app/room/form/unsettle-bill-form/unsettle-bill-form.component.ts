import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { PageRequest, UnsettleBill, Room, Tenant } from '@gmrc/models';
import { FilterType } from '@gmrc/enums';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService, RoomEnumService, TenantService, NotificationService } from '@gmrc/services';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/shared';

@Component({
  selector: 'app-unsettle-bill-form',
  templateUrl: './unsettle-bill-form.component.html',
  styleUrls: ['./unsettle-bill-form.component.scss']
})
export class UnsettleBillFormComponent implements OnInit {
  tenants: Tenant[] = [];
  isLoading = true;
  form = this.formBuilder.group({
    roomNumber: ['', Validators.required],
    roomType: ['', Validators.required],
    dueDate: [''],
    dateExit: [''],
    rentBalance: [''],
    electricBillBalance: [''],
    waterBillBalance: [''],
    riceCookerBillBalance: [''],
    tenants: this.formBuilder.array([]),
    tenantsObjectId: [[]],
    _id: ['']
  });
  pageRequest = new PageRequest(null, null);
  model: UnsettleBill;
  buttonName = 'Add';
  formTitle = 'ADD UNSETTLE BILL';
  roomNumbers: number[] = [];
  oldTenantObjectId: string = null;
  isSubmitting = false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private roomService: RoomService,
    private roomEnumService: RoomEnumService,
    private tenantService: TenantService,
    private notificationService: NotificationService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.isGoingToUpdate();
  }
  get tenantsFormArray(): FormArray {
    return this.form.get('tenants') as FormArray;
  }
  createTenant(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      fromServer: false,
      _id: null,
    });
  }
  loadFormValue(): void {
    this.model.tenants.forEach( tenant => {
      this.tenantsFormArray.push(
        this.formBuilder.group({
          _id: tenant._id,
          name: `${tenant.firstname} ${tenant.middlename} ${tenant.lastname}`,
          fromServer: true,
        })
      );
    });

    this.form.patchValue({
      roomNumber: this.model.roomNumber,
      roomType: this.model.roomType,
      dueDate: this.model.dueDate,
      dateExit: this.model.dateExit,
      rentBalance: this.model.rentBalance,
      electricBillBalance: this.model.electricBillBalance,
      waterBillBalance: this.model.waterBillBalance,
      riceCookerBillBalance: this.model.riceCookerBillBalance,
      _id: this.model._id
    });
  }
  async getUnsettleBillByObjectId(objectId: string): Promise<void> {
    try {
      this.pageRequest.filters.type = FilterType.UNSETTLEBILLBYOBJECTID;
      this.pageRequest.filters.unsettleBillObjectId = objectId;
      const unsettleBill = await this.roomService.getUnsettleBills<UnsettleBill>(this.pageRequest);
      this.model         = unsettleBill.data[0];
      this.loadFormValue();
      this.buttonName    = 'Update';
      this.formTitle     = 'UPDATE UNSETTLE BILL';
      this.isLoading     = false;

    } catch (error) {
    }
  }
  isGoingToUpdate(): void {
    const unsettleBillObjectId = this.route.snapshot.paramMap.get('id');
    this.getRoomNumbers();
    if (unsettleBillObjectId !== null) {
      this.getUnsettleBillByObjectId(unsettleBillObjectId);
    } else {
      this.isLoading = false;
    }
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
  addTenant(): void {
    this.tenantsFormArray.push(this.createTenant());
  }
  get isTenantsArrayEmpty(): boolean {
    let isEmpty = true;
    const tenantFormGroup = this.tenantsFormArray.at(0) as FormGroup;
    if (tenantFormGroup !== undefined) {
      tenantFormGroup.get('_id').value !== null ? isEmpty = false : isEmpty = true;
    }
    return  isEmpty;
  }
  removeTenant(tenantIndex: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Remove Tenant',
        content: `Are you sure you want to remove this tenant?`
      }
    });
    dialogRef.afterClosed().subscribe((removeTenant) => {
      if (removeTenant) {
        const tenantFormGroup = this.tenantsFormArray.at(tenantIndex) as FormGroup;
        if (tenantFormGroup.get('fromServer').value === true) {
          const tenant = {
            tenantObjectId: tenantFormGroup.get('_id').value,
            unsettleBillObjectId: this.form.get('_id').value,
          };
          this.roomService.removeTenantInUnsettleBill(tenant)
           .then( (unsettleBill) => {
              this.notificationService.notifySuccess(`Tenant removed in room number ${unsettleBill.roomNumber}`);
              this.tenantsFormArray.removeAt(tenantIndex);
           })
           .catch( (err) => {
           });

        } else {
          this.tenantsFormArray.removeAt(tenantIndex);
        }
      }
    });
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
  patchTenantObjectId(tenantObjectId: string, tenantIndex: number): void {
    const tenantFormGroup = this.tenantsFormArray.at(tenantIndex) as FormGroup;
    tenantFormGroup.get('_id').setValue(tenantObjectId);
  }
  setTenantsObjectId(form: UnsettleBill): void {
    const tenantsObjectId: Array<string> = [];
    form.tenants.forEach(tenant => {
      tenantsObjectId.push(tenant._id);
    });
    form.tenantsObjectId = tenantsObjectId;
  }
  async onSubmit(): Promise<void> {
    this.isSubmitting = true;
    try {
      this.setTenantsObjectId(this.form.value);
      const unsettleBill        = this.model ? await this.roomService.updateUnsettleBill(this.form.value)
                                             : await this.roomService.addUnsettleBill(this.form.value);
      const notificationMessage = this.model ? `Updated unsettle bill for room number ${unsettleBill.roomNumber}`
                                             : `Added unsettle bill for room number ${unsettleBill.roomNumber}`;
      this.notificationService.notifySuccess(notificationMessage);
      this.model                = unsettleBill;
      this.buttonName           = 'Update';
      this.isSubmitting         = false;

    } catch (error) {
      this.notificationService.notifyFailed('Something went wrong');
      this.isSubmitting = false;
    }
  }
  routeToUnsettleBills(): void {
    this.router.navigate(['room/unsettle-bill']);
  }
}
