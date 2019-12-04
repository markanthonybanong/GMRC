import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Moment} from 'moment';
import { MatDatepicker } from '@angular/material';

@Component({
  selector: 'app-unpaid-balance-tenants',
  templateUrl: './unpaid-balance-tenants.component.html',
  styleUrls: ['./unpaid-balance-tenants.component.scss']
})
export class UnpaidBalanceTenantsComponent implements OnInit {

  form = this.formBuilder.group({
    date: [null, Validators.required]
  });
  date: Moment;
  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
  }
  get monthYear(): string {
    if (!this.date) { return null; }
    return moment(this.date).format('MM/YYYY');
  }
  chosenMonthHandler(date: Moment, datepicker: MatDatepicker<Moment>): void {
    this.date = date;
    this.form.get('date').setValue(this.monthYear);
    datepicker.close();
  }
  openUnpaidBalanceTenantsTab(): void  {
   const date = this.form.get('date').value.replace('/', '-');
   window.open(`print/unpaid-balance-tenants/tenants/${date}`, '_blank');
  }
}
