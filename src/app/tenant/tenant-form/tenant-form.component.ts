import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TenantEnumService, TenantService, NotificationService } from '@gmrc/services';
import { Router, ActivatedRoute } from '@angular/router';
import { Tenant, PageRequest } from '@gmrc/models';
import { FilterType } from '@gmrc/enums';

@Component({
  selector: 'app-tenant-form',
  templateUrl: './tenant-form.component.html',
  styleUrls: ['./tenant-form.component.scss']
})
export class TenantFormComponent implements OnInit {
  form = this.formBuilder.group({
    firstname: ['', Validators.required],
    middlename: ['', Validators.required],
    lastname: ['', Validators.required],
    age: ['', Validators.required],
    gender: ['', Validators.required],
    typeOfNetwork: ['', Validators.required],
    contactNumber: ['', Validators.required],
    emergencyContactNumber: ['', Validators.required],
    roomNumber: '',
    dueRentDate: '',
    address: ['', Validators.required],
    _id: [''],
  });
  model: Tenant;
  formTitle = 'ADD TENANT';
  buttonName = 'Add';
  isSubmitting = false;
  notificationMessage: string = null;
  isLoading = true;
  pageRequest = new PageRequest(1, 5);
  constructor(private formBuilder: FormBuilder,
    private tenantService: TenantService,
    private tenantEnumService: TenantEnumService,
    private router: Router,
    private notificationService: NotificationService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.isGoingToUpdate();
  }
  backToTenantsList(): void {
    this.router.navigate(['tenant']);
  }
  upperCaseFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  loadFormValue(): void {
    this.form.patchValue({
      firstname: this.model.firstname,
      middlename: this.model.middlename,
      lastname: this.model.lastname,
      age: this.model.age,
      gender: this.model.gender,
      typeOfNetwork: this.model.typeOfNetwork,
      contactNumber: this.model.contactNumber,
      emergencyContactNumber: this.model.emergencyContactNumber,
      roomNumber: this.model.roomNumber,
      dueRentDate: this.model.dueRentDate,
      address: this.model.address,
      _id: this.model._id
    });
  }
  getTenantByObjectId(objectId: string): void {
    this.pageRequest.filters.type = FilterType.TENANTBYOBJECTID;
    this.pageRequest.filters.tenantObjectId = objectId;
    this.tenantService.getTenants<Tenant>(this.pageRequest)
    .then(tenant => {
      this.model = tenant.data[0];
      this.loadFormValue();
      this.buttonName = 'Update';
      this.isLoading = false;
    })
    .catch(err => {
    });
  }
  isGoingToUpdate(): void {
    const tenantObjectId = this.route.snapshot.paramMap.get('id');
    tenantObjectId !== null ? this.getTenantByObjectId(tenantObjectId) : this.isLoading = false;
  }
  onSubmit(): void {
    this.isSubmitting = true;
    const formToSend: Tenant = this.form.value;
    formToSend.firstname = this.upperCaseFirstLetter(formToSend.firstname);
    formToSend.middlename = this.upperCaseFirstLetter(formToSend.middlename);
    formToSend.lastname = this.upperCaseFirstLetter(formToSend.lastname);

    let promiseForm: Promise<Tenant>;

    promiseForm = this.model ?
      this.tenantService.updateTenant(formToSend)
      : this.tenantService.addTenant(formToSend);

    promiseForm.then( (tenant) => {
      this.notificationMessage = this.model ?
      `Updated tenant ${tenant.firstname} ${tenant.middlename} ${tenant.lastname}` :
      `Added tenant ${tenant.firstname} ${tenant.middlename} ${tenant.lastname}`;
      this.notificationService.notifySuccess(this.notificationMessage);
      this.form.get('_id').patchValue(tenant._id);
      this.model = tenant;
      this.buttonName = 'Update';
      this.isSubmitting = false;
    })
    .catch( (err) => {
      this.notificationService.notifyFailed('Something went wrong');
      this.isSubmitting = false;
    });
  }
}
