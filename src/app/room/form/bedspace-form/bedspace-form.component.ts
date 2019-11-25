import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { RoomEnumService, RoomService, NotificationService, TenantService, BedService } from '@gmrc/services';
import { RoomType, FilterType, DeckStatus, PatchTo, RoomStatus } from '@gmrc/enums';
import { Router, ActivatedRoute } from '@angular/router';
import { PageRequest, Room, Tenant, DeckToRemove, PatchData, Bedspace, Away, DeckToSend, AwayToSend, Deck } from '@gmrc/models';
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
  haveSelectedDeckTenant = {
    value: false,
    deckIndex: null,
  };
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
    private cdr: ChangeDetectorRef
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
        fromServer: true,
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
  loadBedFormGroupValue(bedIndex: number, bedspace: Bedspace): void {
    const bedFormGroup = this.getBedspacesFormArray().at(bedIndex);
    bedFormGroup.get('fromServer').setValue(true);
    bedFormGroup.get('_id').setValue(bedspace._id);
  }
  loadDeckFormGroupValue(bedIndex: number, deckIndex: number): void {
    const deckFormGroup = this.getDeckInDecksFormArrayInBedspacesFormArray(bedIndex, deckIndex);
    const awayFormArray = deckFormGroup.get('away') as FormArray;
    const awayFormGroup = awayFormArray.at(0) as FormGroup;
    const deckStatus    = deckFormGroup.get('status').value;
    deckFormGroup.get('fromServer').setValue(true);

    if (deckStatus === DeckStatus.AWAY && awayFormGroup === undefined) {
      awayFormArray.push(this.createAway());
    } else if (deckStatus !== DeckStatus.AWAY && awayFormGroup !== undefined) {
      awayFormArray.removeAt(0);
    } else if (deckStatus === DeckStatus.VACANT) {
      this.setDeckFormGroupToNull(bedIndex, deckIndex);
    }
  }
  loadAwayFormGroupValue(bedIndex: number, deckIndex: number): void {
    const deckFormGroup = this.getDeckInDecksFormArrayInBedspacesFormArray(bedIndex, deckIndex);
    const awayFormArray = deckFormGroup.get('away') as FormArray;
    const awayFormGroup = awayFormArray.at(0) as FormGroup;
    const deckStatus    = awayFormGroup.get('status').value;
    awayFormGroup.get('fromServer').setValue(true);
    if (deckStatus === DeckStatus.VACANT) {
      this.setAwayFormGroupToNull(bedIndex, deckIndex);
    }
  }
  getRoom(): void {
    this.roomService.getRooms<Room>(this.pageRequest)
    .then( room => {
      this.model = room.data[0];
      this.loadFormValue();
      this.loadBedspaceFormValue();
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
      dueRentDate: [''],
      monthlyRent: [''],
      away: this.formBuilder.array([]),
      fromServer: false,
      tenantObjectId: null,
      _id: '',
    });
  }
  createAway(): FormGroup {
    return this.formBuilder.group({
      willReturnIn: ['', Validators.required],
      status: [DeckStatus.VACANT, Validators.required],
      inDate: [''],
      inTime: [''],
      outDate: [''],
      outTime: [''],
      dueRentDate: [''],
      rent: [''],
      tenant: [''],
      tenantObjectId: null,
      fromServer: false,
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
  setDeckFormGroupToNull(bedIndex: number, deckIndex: number ): void {
    const decksFormArray = this.getDecksFormArrayInBedspacesFormArray(bedIndex);
    const deckFormGroup = decksFormArray.at(deckIndex) as FormGroup;
    deckFormGroup.get('tenant').patchValue(null);
    deckFormGroup.get('tenantObjectId').patchValue(null);
    deckFormGroup.get('dueRentDate').patchValue(null);
    deckFormGroup.get('monthlyRent').patchValue(null);
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
      this.haveSelectedDeckTenant.value = true;
      this.haveSelectedDeckTenant.deckIndex = patchData.deckIndex;
    } else if (patchTo === PatchTo.AWAYFORMGROUP) {
      const formGroup = this.getBedspacesFormArray().at(patchData.bedIndex) as FormGroup;
      const decksFormGroup = formGroup.get('decks') as FormArray;
      const selectedDeckFormGroup = decksFormGroup.at(patchData.deckIndex) as FormGroup;
      const awayController = selectedDeckFormGroup.get('away') as FormArray;
      const awayFormGroup = awayController.at(0) as FormGroup;
      awayFormGroup.get('tenantObjectId').patchValue(patchData.tenantObjectId);
      this.haveSelectedDeckTenant.value = true;
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
  getDeckTenantToSend(deckIndex: number, bedspace: Bedspace): Bedspace {
    const bedspaceToSend: Bedspace = {_id: null, decks: []} ;
    bedspaceToSend._id   = bedspace._id;
    bedspace.decks[deckIndex]['away'] = null;
    const deck = bedspace.decks[deckIndex];
    if (deck.status === DeckStatus.VACANT ) {
      deck.tenantObjectId = null;
      deck.dueRentDate    = null;
      deck.monthlyRent    = null;
    }
    bedspaceToSend.decks.push(deck);
    return bedspaceToSend;
  }
  getAwayTenantToSend(bedIndex: number , deckIndex: number): {_id: string, deckObjectId: string, away: [Away] } {
    const bedFormGroup  = this.getBedspacesFormArray().at(bedIndex) as FormGroup;
    // tslint:disable-next-line: no-shadowed-variable
    const deckFormGroup = this.getDeckInDecksFormArrayInBedspacesFormArray(bedIndex, deckIndex);
    const deckFormValue = deckFormGroup.value;
    const body = {
      _id: bedFormGroup.get('_id').value,
      deckObjectId: deckFormGroup.get('_id').value,
      away: deckFormValue.away,
    };
    return body;
  }
  setAwayFormGroupToNull(bedIndex: number, deckIndex: number ) {
    const awayFormGroup = this.getAwayFormArrayInDecksFormArray(bedIndex, deckIndex).at(0);
    awayFormGroup.get('inDate').setValue(null);
    awayFormGroup.get('inTime').setValue(null);
    awayFormGroup.get('outDate').setValue(null);
    awayFormGroup.get('outTime').setValue(null);
    awayFormGroup.get('tenant').setValue(null);
    awayFormGroup.get('dueRentDate').setValue(null);
    awayFormGroup.get('rent').setValue(null);
    awayFormGroup.get('tenantObjectId').setValue(null);
    awayFormGroup.get('fromServer').setValue(false);
  }
  displayAddDeckIcon(bedIndex): Boolean {
    const bedFormGroup = this.getBedspacesFormArray().at(bedIndex) as FormGroup;
    return bedFormGroup.get('fromServer').value === true ? true : false;
  }
  displayAddBedButton(bedIndex: number): Boolean {
    const bedFormGroup = this.getBedspacesFormArray().at(bedIndex) as FormGroup;
    return bedFormGroup.get('fromServer').value === true ? false : true;
  }
  async addBedInBedspaceFormGroup(bedIndex: number): Promise<void> {
    this.isSubmitting  = true;
    const bedFormGroup = this.getBedspacesFormArray().at(bedIndex) as FormGroup;
    const roomObjectId = this.form.get('_id').value;
    const number       =  bedFormGroup.get('number').value;
    try {
      const bedspace = await this.roomService.addBed({roomObjectId: roomObjectId, number: number});
      this.loadBedFormGroupValue(bedIndex, bedspace);
      this.notificationService.notifySuccess(`Bed number ${bedspace.number} added`);
      this.isSubmitting = false;
    } catch (error) {
      this.notificationService.notifyFailed('Something went wrong');
      this.isSubmitting = false;
    }
  }
  async addDeckInBedspaceFormGoup(bedIndex: number, deckIndex: number, updateBedspace: boolean = false): Promise<void> {
    this.isSubmitting                         = true;
    const bedspaceFormGroup                   = this.getBedspacesFormArray().at(bedIndex) as FormGroup;
    const bedspaceFormValue                   = bedspaceFormGroup.getRawValue();
    bedspaceFormValue['roomObjectId']         = this.form.get('_id').value;
    const formToSend                          = this.getDeckTenantToSend(deckIndex, bedspaceFormValue);
    const deckFormGroup                       = this.getDeckInDecksFormArrayInBedspacesFormArray(bedIndex, deckIndex);
    const tenantObjectId                      = deckFormGroup.get('tenantObjectId').value;
    try {
      this.pageRequest.filters.type           = FilterType.ROOMSBYTENANTOBJECTID;
      this.pageRequest.filters.tenantObjectId = tenantObjectId;
      const rooms = await this.roomService.getRooms(this.pageRequest);
      /**check when deck is already created */
      if (deckFormGroup.get('fromServer').value === true && tenantObjectId !== null) {
        if (rooms.data.length === 0 || this.haveSelectedDeckTenant.value === false) {
          console.log('teh form to ',formToSend);

          const bedspace = await this.roomService.updateDeckInBed(formToSend);
          this.loadDeckFormGroupValue(bedIndex, deckIndex);
          this.notificationService.notifySuccess(`Deck number ${bedspace.decks[deckIndex].number} updated`);
          this.tenants = [];
          this.haveSelectedDeckTenant.value = false;
          this.isSubmitting = false;
        } else {
          this.notificationService.notifySuccess('Tenant already added');
          this.isSubmitting = false;
        }
      } else if (rooms.data.length === 0 ) { /** check when adding a deck, and for creating empty deck*/
        const bedspace = updateBedspace
                          ? await this.roomService.updateDeckInBed(formToSend)
                          : await this.roomService.addDeckInBed(formToSend);
          const notificationMessage = updateBedspace
                                        ? `Deck number ${bedspace.decks[deckIndex].number} updated`
                                        : `Deck number ${bedspace.decks[deckIndex].number} added`;
          this.haveSelectedDeckTenant.value = false;
          this.loadDeckFormGroupValue(bedIndex, deckIndex);
          this.notificationService.notifySuccess(notificationMessage);
          this.tenants = [];
          this.isSubmitting = false;
      } else {
        this.notificationService.notifySuccess('Tenant already added');
        this.isSubmitting = false;
      }
    } catch (error) {
      console.log(error);
      this.notificationService.notifyFailed('Something went wrong');
      this.isSubmitting = false;
    }
  }
  async addUpdateAwayInDeckFormGroup(bedIndex: number, deckIndex, updateBedspace = false): Promise<void> {
    this.isSubmitting = true;
    try {
      const formToSend: {
        _id: string,
        deckObjectId: string,
        away: [Away],
      } = this.getAwayTenantToSend(bedIndex, deckIndex);
      const deckFormGroup                     = this.getDeckInDecksFormArrayInBedspacesFormArray(bedIndex, deckIndex);
      const awayFormArray                     = deckFormGroup.get('away') as FormArray;
      const awayFormGroup                     = awayFormArray.at(0) as FormGroup;
      this.pageRequest.filters.type           = FilterType.ROOMSBYTENANTOBJECTID;
      this.pageRequest.filters.tenantObjectId = formToSend.away[0].tenantObjectId;
      const rooms = await this.roomService.getRooms(this.pageRequest);
        /**check when deck is already created */
      if (awayFormGroup.get('fromServer').value === true && formToSend.away[0].tenantObjectId !== null) {
        if (rooms.data.length === 0 || this.haveSelectedDeckTenant.value === false) {
          const bedspace = await this.roomService.addUpdateAwayInDeck(formToSend);
          this.haveSelectedDeckTenant.value = false;
          this.loadAwayFormGroupValue(bedIndex, deckIndex);
          this.notificationService.notifySuccess(`Updated Away tenant in deck number ${bedspace.decks[deckIndex].number}`);
          this.tenants = [];
          this.isSubmitting = false;
        } else {
          this.notificationService.notifySuccess('Tenant already added');
          this.isSubmitting = false;
        }
      } else if (rooms.data.length === 0 ) { /** check when adding a deck, and for creating empty deck*/
        const bedspace = await this.roomService.addUpdateAwayInDeck(formToSend);
        const notificationMessage = updateBedspace
                                      ? `Updated Away tenant in deck number ${bedspace.decks[deckIndex].number}`
                                      : `Added Away tenant in deck number ${bedspace.decks[deckIndex].number}`;
        this.haveSelectedDeckTenant.value = false;
        this.loadAwayFormGroupValue(bedIndex, deckIndex);
        this.notificationService.notifySuccess(notificationMessage);
        this.tenants = [];
        this.isSubmitting = false;
      } else {
        this.notificationService.notifySuccess('Tenant already added');
        this.isSubmitting = false;
      }
    } catch (error) {
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
