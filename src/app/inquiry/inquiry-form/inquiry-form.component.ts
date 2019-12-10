import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { MatSelectChange } from '@angular/material';
import { RoomType, FilterType } from '@gmrc/enums';
import { Router, ActivatedRoute } from '@angular/router';
import { Inquiry, PageRequest, Filter } from '@gmrc/models';
import { RoomEnumService, InquiryService, NotificationService, TenantEnumService } from '@gmrc/services';

@Component({
  selector: 'app-inquiry-form',
  templateUrl: './inquiry-form.component.html',
  styleUrls: ['./inquiry-form.component.scss']
})
export class InquiryFormComponent implements OnInit {
  statuses: Array<string> = ['Waiting', 'Settled'];
  knownGMRCThrough: Array<string> = [
    'Through social platforms',
    'Someone suggested',
    'Flyers',
    'etc'
  ];
  form = this.formBuilder.group({
    name: ['', Validators.required],
    roomNumber: ['', Validators.required],
    howDidYouFindUs:  ['', Validators.required],
    willOccupyIn:  ['', Validators.required],
    phoneNumber: ['', Validators.required],
    gender: ['', Validators.required],
    roomType:  ['', Validators.required],
    bedInfos: this.formBuilder.array([]),
    _id: '',
  });
  formTitle = 'ADD INQUIRY';
  isLoading = true;
  buttonName = 'Add';
  isSubmitting = false;
  model: Inquiry;
  pageRequest = new PageRequest(1, 5);

  constructor(
    private formBuilder: FormBuilder,
    private roomEnumService: RoomEnumService,
    private router: Router,
    private inquiryService: InquiryService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private tenantEnumService: TenantEnumService,
    ) { }

  ngOnInit() {
    this.isGoingToUpdate();
  }
  get bedInfos(): FormArray {
    return this.form.get('bedInfos') as FormArray;
  }
  pushBedFormGroup(): void {
    this.bedInfos.push(this.bed());
  }
  removeBedFormGroup(): void {
    if (this.bedInfos.length) {
      this.bedInfos.removeAt(0);
    }
  }
  roomTypeToggle($even: MatSelectChange): void {
    if ($even.value === RoomType.BEDSPACE) {
      this.pushBedFormGroup();
    } else {
      this.removeBedFormGroup();
    }
  }
  bed(): FormGroup {
    return this.formBuilder.group({
      bedNumber: ['', Validators.required],
      deckNumber: ['', Validators.required]
    });
  }
  backToInquiryList(): void {
    this.router.navigate(['inquiry']);
  }
  onSubmit(): void {
    this.isSubmitting = true;
    let promiseForm: Promise<Inquiry>;
    promiseForm = this.model
    ? this.inquiryService.updateInquiry(this.form.value)
    : this.inquiryService.addInquiry(this.form.value);
    promiseForm.then( (inquiry) => {
      const notificationMessage = this.model ?
      `Updated inquiry for ${inquiry.name}` :
      `Added inquiry for ${inquiry.name}`;
      this.notificationService.notifySuccess(notificationMessage);
      this.form.get('_id').patchValue(inquiry._id);
      this.model = inquiry;
      this.isSubmitting = false;
      this.buttonName = 'Update';
    })
    .catch( (err) => {
      this.notificationService.notifyFailed('Something went wrong');
      this.isSubmitting = false;
    });
  }
  loadFormValue(): void {
    if (this.model.bedInfos.length) {
      this.bedInfos.push(
        this.formBuilder.group({
          bedNumber: this.model.bedInfos[0].bedNumber,
          deckNumber: this.model.bedInfos[0].deckNumber,
        })
      );
    }
    this.form.patchValue({
      _id: this.model._id,
      howDidYouFindUs: this.model.howDidYouFindUs,
      name: this.model.name,
      roomNumber: this.model.roomNumber,
      roomType: this.model.roomType,
      willOccupyIn: this.model.willOccupyIn,
      gender: this.model.gender,
      phoneNumber: this.model.phoneNumber
    });
  }
  getInquiryByObjectId(objectId: string): void {
    this.pageRequest.filters.type = FilterType.INQUIRYBYOBJECTID;
    this.pageRequest.filters.inquiryObjectId = objectId;
    this.inquiryService.getInquiries<Inquiry>(this.pageRequest)
    .then(inquiry => {
      this.model = inquiry.data[0];
      this.loadFormValue();
      this.formTitle  = 'UPDATE INQUIRY';
      this.buttonName = 'Update';
      this.isLoading  = false;
    })
    .catch(err => {
    });
  }
  isGoingToUpdate(): void {
    const inquiryObjectId = this.route.snapshot.paramMap.get('id');
    if (inquiryObjectId !== null) {
      this.getInquiryByObjectId(inquiryObjectId);
    } else {
      this.isLoading = false;
    }
  }
}
