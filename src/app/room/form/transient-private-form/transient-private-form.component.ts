import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { RoomEnumService, RoomService, NotificationService, TenantService } from '@gmrc/services';
import { PageRequest, Room, Tenant } from '@gmrc/models';
import { FilterType, RoomType } from '@gmrc/enums';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '@gmrc/shared';

@Component({
  selector: 'app-transient-private-form',
  templateUrl: './transient-private-form.component.html',
  styleUrls: ['./transient-private-form.component.scss']
})
export class TransientPrivateFormComponent implements OnInit {
  isLoading = true;
  isSubmitting = false;
  pageRequest = new PageRequest(1, 5);
  model: Room;
  tenants: Tenant[] = [];
  oldTenantObjectId: string = null;
  roomTypes: string[] = [RoomType.PRIVATE, RoomType.TRANSIENT];
  form = this.formBuilder.group({
    number: ['', Validators.required],
    floor: ['', Validators.required],
    type: ['', Validators.required],
    aircon: ['', Validators.required],
    transientPrivateRoomProperties: this.formBuilder.array([]),
    _id: ['']
  });
  tenantForm = this.formBuilder.group({
    tenants: this.formBuilder.array([]),
  });

  constructor(
    private formBuilder: FormBuilder,
    private roomEnumService: RoomEnumService,
    private roomService: RoomService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private tenantService: TenantService
  ) { }

  ngOnInit() {
    this.pageRequest.filters.type = FilterType.TRANSIENTPRIVATEROOMBYOBJECTID;
    this.pageRequest.filters.roomObjectId = this.route.snapshot.paramMap.get('id');
    this.getRoom();
  }
  loadFormValue(): void {
    if (this.model.transientPrivateRoomProperties.length > 0 ) {
      const transientPrivateRoomProperties = this.form.get('transientPrivateRoomProperties') as FormArray;
      transientPrivateRoomProperties.push(
        this.formBuilder.group({
          status: this.model.transientPrivateRoomProperties[0].status,
          dueRent: this.model.transientPrivateRoomProperties[0].dueRent,
        })
      );
    }
    this.form.patchValue({
      number: this.model.number,
      floor: this.model.floor,
      type: this.model.type,
      aircon: this.model.aircon,
      _id: this.model._id,
    });
  }
  loadTenantFormValue(): void {
    this.model.tenantsArr.forEach( (element) => {
      this.getTenantsFormArray().push(
        this.formBuilder.group({
          _id: element._id,
          name: `${element.firstname} ${element.middlename} ${element.lastname}`,
          fromServer: true,
        })
      );
    });
  }
  getRoom(): void {
    this.roomService.getRooms<Room>(this.pageRequest)
      .then( room => {
        this.model = room.data[0];
        this.loadFormValue();
        this.loadTenantFormValue();
        this.isLoading = false;
      })
      .catch ( err => {
      });
  }
  createTenant(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      _id: '',
      fromServer: false,
    });
  }
  getTenantsFormArray(): FormArray {
    return this.tenantForm.get('tenants') as FormArray;
  }
  addTenant(): void {
    this.getTenantsFormArray().push(this.createTenant());
  }
  removeTenant(tenantIndex: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Remove Tenant',
        content: `Are you sure you want to remove tenant number ${tenantIndex + 1}?`
      }
    });
    dialogRef.afterClosed().subscribe((removeTenant) => {
      if (removeTenant) {
        const tenantFormGroup = this.getTenantsFormArray().at(tenantIndex) as FormGroup;
        if (tenantFormGroup.get('fromServer').value === true) {
          const tenant = {
            tenantObjectId: tenantFormGroup.get('_id').value,
            roomObjectId: this.form.get('_id').value,
          };
          this.roomService.removeTenantInTransientPrivateRoom(tenant)
           .then( (room) => {
              const notificationMessage = `Tenant removed in room number ${room.number}`;
              this.notificationService.notifySuccess(notificationMessage);
              this.getTenantsFormArray().removeAt(tenantIndex);
           })
           .catch( (err) => {
           });
        } else {
          this.getTenantsFormArray().removeAt(tenantIndex);
        }
      }
    });
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
  setTenantOldObjectId(tenantIndex: number): void  {
    const tenantFormGroup = this.getTenantsFormArray().at(tenantIndex) as FormGroup;
    const tenantObjectId = tenantFormGroup.get('_id').value;
    if (tenantObjectId !== null) {
      this.oldTenantObjectId = tenantFormGroup.get('_id').value;
    }
  }
  patchTenantObjectId(tenantObjectId: string, tenantIndex: number): void {
    const tenantFormGroup = this.getTenantsFormArray().at(tenantIndex) as FormGroup;
    tenantFormGroup.get('_id').patchValue(tenantObjectId);
  }
  tenantFormOnSubmit(tenantIndex: number, updateTenant: boolean = false): void {
    if (this.tenants.length === 0) {
      this.notificationService.notifyFailed('Something went wrong');
    } else {
      const tenantFormGroup = this.getTenantsFormArray().at(tenantIndex) as FormGroup;
      const tenantObjectId  = tenantFormGroup.get('_id').value;
      const tenant = {
        roomObjectId: this.form.get('_id').value,
        oldTenantObjectId: this.oldTenantObjectId,
        tenantObjectId: tenantObjectId,
      };
      const PromiseForm: Promise<Room> = updateTenant
      ? this.roomService.updateTenantInTransientPrivateRoom(tenant)
      : this.roomService.addTenantInTransientPrivateRoom(tenant);
      PromiseForm.then( (room) => {
        const notificationMessage = updateTenant
        ? `Updated tenant in room number ${room.number}`
        : `Added tenant in room number ${room.number}`;
        this.notificationService.notifySuccess(notificationMessage);
        tenantFormGroup.get('fromServer').setValue(true);
        this.tenants = [];
      })
      .catch( (err) => {
        this.notificationService.notifyFailed('Something went wrong');
      });
    }
  }
  formOnSubmit(): void {
    this.isSubmitting = true;
    let promiseForm: Promise<Room>;
    promiseForm = this.model
     ? this.roomService.updateRoom(this.form.value)
     : this.roomService.addRoom(this.form.value);
    promiseForm.then( (room) => {
       this.notificationService.notifySuccess(`Updated room number ${room.number}`);
       this.isSubmitting = false;
    })
    .catch( (err) => {
       this.notificationService.notifyFailed('Something went wrong');
       this.isSubmitting = false;
    });
  }
  routeToTransientPrivateRooms(): void {
    this.router.navigate(['room/private-transient']);
  }
  /**
   * Manually trigger change detection, so view can be render again
   */
  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

}
