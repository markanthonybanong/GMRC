import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { RoomEnumService, RoomService, NotificationService, TenantService, BedService } from '@gmrc/services';
import { RoomType, FilterType, DeckStatus, PatchTo, RoomStatus } from '@gmrc/enums';
import { Router, ActivatedRoute } from '@angular/router';
import { PageRequest, Room, Tenant, DeckToRemove, PatchData, Bedspace, Away } from '@gmrc/models';
import { MatSelectChange, MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '@gmrc/shared';

@Component({
  selector: 'app-bedspace-form',
  templateUrl: './bedspace-form.component.html',
  styleUrls: ['./bedspace-form.component.scss']
})
export class BedspaceFormComponent implements OnInit {
  roomTypes: string[] = [RoomType.BEDSPACE];
  pageRequest = new PageRequest(1, 5);
  isLoading = true;
  model: Room;
  tenants: Tenant[] = [];
  isSubmitting = false;
  form = this.formBuilder.group({
    number: ['', Validators.required],
    floor: ['', Validators.required],
    type: ['', Validators.required],
    aircon: ['', Validators.required],
    _id: ['']
  });
  bedspaceForm = this.formBuilder.group({
    bedspaces: this.formBuilder.array([]),
  });

  constructor(
    private formBuilder: FormBuilder,
    private roomEnumService: RoomEnumService,
    private router: Router,
    private route: ActivatedRoute,
    private roomService: RoomService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private tenantService: TenantService,
    private bedService: BedService,
  ) { }

  ngOnInit() {
    this.pageRequest.filters.type = FilterType.BEDSPACEROOMBYOBJECTID;
    this.pageRequest.filters.roomObjectId = this.route.snapshot.paramMap.get('id');
    this.getRoom();
  }
  loadFormValue(): void {
    this.form.patchValue({
      number: this.model.number,
      floor: this.model.floor,
      type: this.model.type,
      aircon: this.model.aircon,
      _id: this.model._id,
    });
  }
  patchAwayFormValue(awayFormValues: Away[]): FormArray {
    const away = awayFormValues[0];
    return  this.formBuilder.array([
      this.formBuilder.group({
        willReturnIn: away.willReturnIn,
        status: away.status,
        inDate: away.inDate,
        inTime: away.inTime,
        outDate: away.outDate,
        outTime: away.outTime,
        dueRentDate: away.dueRentDate,
        rent: away.rent,
        tenant: away.tenant !== null ? `${away.tenant.firstname} ${away.tenant.middlename} ${away.tenant.lastname}` : null,
        tenantObjectId: away.tenant !== null ? away.tenant._id : null,
      }),
    ]);
  }
  loadBedspaceFormValue(): void {
    this.model.bedspaces.forEach( (bedspace, bedIndex) => {
      const decks = this.formBuilder.array([]);
      bedspace.decks.forEach( (deck, deckIndex) => {
        decks.push(this.formBuilder.group({
          _id: deck._id,
          number: deck.number,
          status: deck.status,
          dueRentDate: deck.dueRentDate,
          monthlyRent: deck.monthlyRent,
          tenant: deck.tenant !== null ? `${deck.tenant.firstname}  ${deck.tenant.middlename} ${deck.tenant.lastname}` : null,
          away: deck.away !== null ? this.patchAwayFormValue(deck.away) : this.formBuilder.array([]),
          fromServer: true,
          tenantObjectId: deck.tenant !== null ? deck.tenant._id : null,
        }));
      });
      this.getBedspacesFormArray().push(
        this.formBuilder.group({
          _id: bedspace._id,
          number: bedspace.number,
          fromServer: true,
          decks: decks,
        })
      );
    });
  }
  disableDueRentDates(): void {
    this.getBedspacesFormArray().controls.forEach((bedFormGroup, bedIndex) => {
      this.getDecksFormArrayInBedspacesFormArray(bedIndex).controls.forEach((decksFormGroup, deckIndex) => {
        const deckFormGroup = this.getDeckInDecksFormArrayInBedspacesFormArray(bedIndex, deckIndex);
        if (deckFormGroup.get('dueRentDate').value !== null) {
            deckFormGroup.get('dueRentDate').disable();
        }
        if (deckFormGroup.get('away').value.length > 0) {
          const deckFormArray = this.getAwayFormArrayInDecksFormArray(bedIndex, deckIndex) as FormArray;
          const awayFormGroup = deckFormArray.at(0);
          if (awayFormGroup.get('dueRentDate').value !== null) {
            awayFormGroup.get('dueRentDate').disable();
          }
        }
      });
    });
  }
  disableBedspaceDueRentDates(bedIndex, bedspace: Bedspace): void {
      bedspace.decks.forEach((secondDeck, secondIndex) => {
        if (secondDeck.dueRentDate !== null) {
          const deckFormGroup = this.getDeckInDecksFormArrayInBedspacesFormArray(bedIndex, secondIndex);
          deckFormGroup.get('dueRentDate').disable();
        }
        if (secondDeck.away !== null) {
          if (secondDeck.away[0].dueRentDate !== null ) {
            const awayFormArray =  this.getAwayFormArrayInDecksFormArray(bedIndex, secondIndex) as FormArray;
            const awayFormGroup = awayFormArray.at(0);
            awayFormGroup.get('dueRentDate').disable();
          }
        }
      });
  }
  getRoom(): void {
    this.roomService.getRooms<Room>(this.pageRequest)
    .then( room => {
      this.model = room.data[0];
      this.loadFormValue();
      this.loadBedspaceFormValue();
      this.disableDueRentDates();
      this.isLoading = false;
    })
    .catch ( err => {
    });
  }

  get bedNumber(): number {
    const bed =  this.getBedspacesFormArray().length !== 0 ?
                 this.getBedspacesFormArray().at(this.getBedspacesFormArray().length - 1) as FormGroup : false;
    return bed ? bed.get('number').value + 1 : 1;
  }
  getDeckNumber(bedIndex): number {
    const bed = this.getBedspacesFormArray().at(bedIndex) as FormGroup;
    const decks = bed.get('decks') as FormArray;
    return decks.length !== 0 ? decks.at(decks.length - 1).get('number').value + 1 : 1;
  }
  getBedspacesFormArray(): FormArray {
    return this.bedspaceForm.get('bedspaces') as FormArray;
  }
  getDecksFormArrayInBedspacesFormArray(bedIndex: number): FormArray {
    const bed = this.getBedspacesFormArray().at(bedIndex) as FormGroup;
    return bed.get('decks') as FormArray;
  }
  getDeckInDecksFormArrayInBedspacesFormArray(bedIndex, deckIndex): FormGroup {
    const bed = this.getBedspacesFormArray().at(bedIndex) as FormGroup;
    const decks = bed.get('decks') as FormArray;
    return decks.at(deckIndex) as FormGroup;
  }
  getAwayFormArrayInDecksFormArray(bedIndex: number, deckIndex: number): FormArray {
    const decks = this.getDecksFormArrayInBedspacesFormArray(bedIndex);
    const deck = decks.at(deckIndex) as FormGroup;
    return deck.get('away') as FormArray;
  }
  createBed(): FormGroup {
    return this.formBuilder.group({
      number: [this.bedNumber, Validators.required],
      decks: this.formBuilder.array([]),
      fromServer: false,
      _id: '',
    });
  }
  createDeck(bedIndex: number): FormGroup {
    return this.formBuilder.group({
      number: [this.getDeckNumber(bedIndex), Validators.required],
      status: [DeckStatus.VACANT, Validators.required],
      tenant: [''],
      dueRentDate: [{value: '', disabled: false}],
      monthlyRent: [''],
      away: this.formBuilder.array([]),
      fromServer: false,
      tenantObjectId: null,
      _id: '',
    });
  }
  createAwayFields(): FormGroup {
    return this.formBuilder.group({
      willReturnIn: ['', Validators.required],
      status: [DeckStatus.VACANT, Validators.required],
      inDate: [''],
      inTime: [''],
      outDate: [''],
      outTime: [''],
      dueRentDate: [{value: '', disabled: false}],
      rent: [''],
      tenant: null,
      tenantObjectId: null,
    });
  }
  addBedspaceFormGroup(): void {
    this.getBedspacesFormArray().push(this.createBed());
  }
  removeBedspaceFormGroup(bedIndex: number, bedNumber: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Remove Bed',
        content: `Are you sure you want to remove bed number ${bedNumber} and its content?`
      }
    });
    dialogRef.afterClosed().subscribe((removeBed) => {
      if (removeBed) {
        const bedFormGroup = this.getBedspacesFormArray().at(bedIndex) as FormGroup;
        const roomFormGroup = this.form as FormGroup;
        if (bedFormGroup.get('fromServer').value === true ) {
          this.roomService.removeBedSpace({bedObjectId: bedFormGroup.get('_id').value, roomObjectId: roomFormGroup.get('_id').value})
          .then( (bedspace) => {
            const notificationMessage = `Removed bed number ${bedspace.number}`;
            this.notificationService.notifySuccess(notificationMessage);
            this.getBedspacesFormArray().removeAt(bedIndex);
          })
          .catch( (err) => {
            this.notificationService.notifyFailed('Something went wrong');
          });
        } else {
          this.getBedspacesFormArray().removeAt(bedIndex);
        }
      }
    });
  }
  removeDeckFormGroup(bedIndex: number, deckIndex: number, deckNumber: number,  deckToRemove: DeckToRemove): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Remove Deck',
        content: `Are you sure you want to remove deck number ${deckNumber} and its content?`
      }
    });
    dialogRef.afterClosed().subscribe((removeDeck) => {
      if (removeDeck) {
        if (deckToRemove.fromServer === true ) {
            const deck = {
              bedObjectId: deckToRemove.bedObjectId,
              deckObjectId: deckToRemove.deckObjectId
            };
            this.roomService.removeDeckInBedspace(deck)
            .then( bedspace => {
              this.notificationService.notifySuccess(`Removed deck number ${deckNumber} in bed number ${bedIndex + 1}`);
              this.getDecksFormArrayInBedspacesFormArray(bedIndex).removeAt(deckIndex);
            })
            .catch ( err => {
              this.notificationService.notifyFailed('Something went wrong');
            });
        } else {
          this.getDecksFormArrayInBedspacesFormArray(bedIndex).removeAt(deckIndex);
        }
      }
    });
  }
  addDeck(bedIndex: number): void {
    this.getDecksFormArrayInBedspacesFormArray(bedIndex).push(this.createDeck(bedIndex));
  }
  setBedspaceFormGroupToNull(bedIndex: number, deckIndex: number ): void {
    const decks = this.getDecksFormArrayInBedspacesFormArray(bedIndex);
    const bed = decks.at(deckIndex) as FormGroup;
    bed.get('tenant').patchValue(null);
    bed.get('tenantObjectId').patchValue(null);
    bed.get('dueRentDate').patchValue(null);
    bed.get('monthlyRent').patchValue(null);
  }
  deckStatusToggle($event: MatSelectChange, bedIndex: number, deckIndex: number): void {
    if ($event.value === DeckStatus.AWAY) {
      this.getAwayFormArrayInDecksFormArray(bedIndex, deckIndex).push(this.createAwayFields());
    } else if ($event.value !== DeckStatus.AWAY && this.getAwayFormArrayInDecksFormArray(bedIndex, deckIndex).length !== 0) {
      this.getAwayFormArrayInDecksFormArray(bedIndex, deckIndex).removeAt(0);
      if ($event.value === DeckStatus.VACANT) {
        this.setBedspaceFormGroupToNull(bedIndex, deckIndex);
      }
    } else if ($event.value === DeckStatus.VACANT) {
       this.setBedspaceFormGroupToNull(bedIndex, deckIndex);
       const deckFormGroup = this.getDeckInDecksFormArrayInBedspacesFormArray(bedIndex, deckIndex) as FormGroup;
       deckFormGroup.get('dueRentDate').enable();
    }
  }
  searchTenantNameFieldInput(inputTenantName: string): void {
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
  patchTenantObjectId(patchTo: string, patchData: PatchData): void {
    if (patchTo === PatchTo.DECKFORMGROUP) {
      const formGroup = this.getBedspacesFormArray().at(patchData.bedIndex) as FormGroup;
      const decksFormGroup = formGroup.get('decks') as FormArray;
      const selectedDeckFormGroup = decksFormGroup.at(patchData.deckIndex) as FormGroup;
      selectedDeckFormGroup.get('tenantObjectId').patchValue(patchData.tenantObjectId);
    } else if (patchTo === PatchTo.AWAYFORMGROUP) {
      const formGroup = this.getBedspacesFormArray().at(patchData.bedIndex) as FormGroup;
      const decksFormGroup = formGroup.get('decks') as FormArray;
      const selectedDeckFormGroup = decksFormGroup.at(patchData.deckIndex) as FormGroup;
      const awayController = selectedDeckFormGroup.get('away') as FormArray;
      const awayFormGroup = awayController.at(0) as FormGroup;
      awayFormGroup.get('tenantObjectId').patchValue(patchData.tenantObjectId);
    }
  }
  isBedspaceValid(bedIndex: number): boolean {
    return this.getBedspacesFormArray().at(bedIndex).valid;
  }
  routeToBedspaceRooms(): void {
    this.router.navigate(['room/bedspace']);
  }
  patchDataInBedspaceFormGroup(bedspaceFormGroup: FormGroup, result: Bedspace): void {
    bedspaceFormGroup.get('fromServer').patchValue(true);
    bedspaceFormGroup.get('_id').patchValue(result._id);
    const decks = result.decks;
    decks.forEach( (element, index) => {
        const bedspaceDecks = bedspaceFormGroup.get('decks') as FormArray;
        const deckFormGroup = bedspaceDecks.at(index) as FormGroup;
        deckFormGroup.get('_id').patchValue(element._id);
        deckFormGroup.get('fromServer').patchValue(true);
    });
  }
  formatAwayFormValues(awayFormGroup: Away[]): Array<Away> {
    const away = [];
    awayFormGroup.forEach( element => {
      away.push({
        inDate: element.inDate,
        inTime: element.inTime,
        outDate: element.outDate,
        outTime: element.outTime,
        status: element.status,
        dueRentDate: element.dueRentDate,
        rent: element.rent,
        tenant: element.tenantObjectId !== null ? element.tenantObjectId : null,
        willReturnIn: element.willReturnIn,
      });
    });
    return away;
  }
  formatBedspaceFormValues(bedspaceFormGroup: Bedspace, deckIndex: number): Bedspace {
    const modifiedDecks  = [];
    let deckObject       = {};
    const decksFormArray = bedspaceFormGroup.decks;
    if (bedspaceFormGroup.decks.length > 0) {
      for (let index = 0; index <  decksFormArray.length; index++) {
        if (deckIndex === index) {
          deckObject = {};
          deckObject['number']      = decksFormArray[index].number;
          deckObject['status']      = decksFormArray[index].status;
          deckObject['tenant']      = decksFormArray[index].tenantObjectId !== null ? decksFormArray[index].tenantObjectId : null;
          deckObject['dueRentDate'] = decksFormArray[index].dueRentDate;
          deckObject['monthlyRent'] = decksFormArray[index].monthlyRent;
          deckObject['away']        = decksFormArray[index].away.length > 0 ? this.formatAwayFormValues(decksFormArray[index].away) : null;
          modifiedDecks.push(deckObject);
          break;
        }
      }
    }
    bedspaceFormGroup.decks = modifiedDecks;
    return bedspaceFormGroup;
  }
  emptyFormControlInAwayFormGroup(bedIndex: number, deckIndex: number ) {
    const awayFormGroup = this.getAwayFormArrayInDecksFormArray(bedIndex, deckIndex).at(0);
    awayFormGroup.get('inDate').patchValue(null);
    awayFormGroup.get('inTime').patchValue(null);
    awayFormGroup.get('outDate').patchValue(null);
    awayFormGroup.get('outTime').patchValue(null);
    awayFormGroup.get('tenant').patchValue(null);
    awayFormGroup.get('dueRentDate').patchValue(null);
    awayFormGroup.get('rent').patchValue(null);
    awayFormGroup.get('tenantObjectId').patchValue(null);
  }
  setAwayFormGroupToNull(bedIndex: number, deckIndex: number, $event: MatSelectChange): void {
    if ($event.value === RoomStatus.VACANT ) {
      this.emptyFormControlInAwayFormGroup(bedIndex, deckIndex);
    }
  }
  getBedspaceTenantsObjectId(formValue: Bedspace): Array<string> {
    const tenants: Array<string> = [];
    formValue.decks.forEach(deck => {
      if (deck.tenantObjectId !== null) {
        tenants.push(deck.tenantObjectId);
      }
      if (deck.away.length > 0) {
        if (deck.away[0].tenant !== null) {
          tenants.push(deck.away[0].tenantObjectId);
        }
      }
    });
    return tenants;
  }
  displayAddDeckIcon(): Boolean {
    const deckFormGroup = this.getDeckInDecksFormArrayInBedspacesFormArray(0, 0);
    return deckFormGroup !== undefined && deckFormGroup.get('fromServer').value === true ? true : false;
  }
  addBed(): void {
    const bedFormGroup = this.getBedspacesFormArray().at(0) as FormGroup;
    const roomObjectId = this.form.get('_id').value;
    const bedNumber    =  bedFormGroup.get('number').value;
    try {
      console.log('bedNumber', bedNumber);
      console.log('roomObject ', roomObjectId);
    } catch (error) {

    }
  }
  async bedspaceFormOnSubmit(bedIndex: number, deckIndex: number, updateBedspace: boolean = false): Promise<void> {
    this.isSubmitting                         = true;
    const bedspaceFormGroup                   = this.getBedspacesFormArray().at(bedIndex) as FormGroup;
    const bedspaceFormValue                   = bedspaceFormGroup.getRawValue();
    bedspaceFormValue['roomObjectId']         = this.form.get('_id').value;
    const formToSend                          = this.formatBedspaceFormValues(bedspaceFormValue, deckIndex);
    const deckFormGroup                       = this.getDeckInDecksFormArrayInBedspacesFormArray(bedIndex, deckIndex);
    try {
      this.pageRequest.filters.type           = FilterType.ROOMSBYTENANTOBJECTID;
      this.pageRequest.filters.tenantObjectId = deckFormGroup.get('tenantObjectId').value;
      const rooms = await this.roomService.getRooms(this.pageRequest);
      if (rooms.data.length === 0) {
        console.log('fomr to send ', formToSend);
        const bedspace = updateBedspace
                            ? await this.roomService.updateBedspace(formToSend)
                            : await this.roomService.addBedspace(formToSend);
        this.disableBedspaceDueRentDates(bedIndex, bedspace);
        const notificationMessage = updateBedspace
                                      ? `Deck number ${bedspace.decks[deckIndex].number} updated`
                                      : `Deck number ${bedspace.decks[deckIndex].number} added`;
        this.patchDataInBedspaceFormGroup(bedspaceFormGroup, bedspace);
        this.notificationService.notifySuccess(notificationMessage);
        this.tenants = [];
        this.isSubmitting = false;
      } else {
        this.notificationService.notifySuccess('Tenant already added');
        this.isSubmitting = false;
      }
    } catch (error) {
      console.log('bedspace form ', error);
      this.notificationService.notifyFailed('Something went wrong');
      this.isSubmitting = false;
    }
  }
  formOnSubmit(): void {
    this.isSubmitting = true;
    let promiseForm: Promise<Room>;
    promiseForm = this.roomService.updateRoom(this.form.value);
    promiseForm.then( (room) => {
       const notificationMessage = `Updated room number ${room.number}`;
       this.notificationService.notifySuccess(notificationMessage);
       this.isSubmitting = false;
    })
    .catch( (err) => {
       this.notificationService.notifyFailed('Something went wrong');
       this.isSubmitting = false;
    });
  }
}
