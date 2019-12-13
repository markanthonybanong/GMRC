import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PageRequest, Tenant } from '@gmrc/models';
import { FilterType } from '@gmrc/enums';
import { TenantService, NotificationService } from '@gmrc/services';

@Component({
  selector: 'app-promisory-note',
  templateUrl: './promisory-note.component.html',
  styleUrls: ['./promisory-note.component.scss']
})
export class PromisoryNoteComponent implements OnInit {
  form = this.formBuilder.group({
    name: [null, Validators.required]
  });
  pageRequest = new PageRequest(null, null);
  tenants: Tenant[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private tenantService: TenantService,
  ) { }

  ngOnInit() {
  }

  async searchTenant(inputTenantName: string): Promise<void> {
    if (inputTenantName.length !== 0 ) {
      try {
        this.pageRequest.filters.tenantName = inputTenantName;
        this.pageRequest.filters.type = FilterType.TENANTBYKEYSTROKE;
        const tenant = await this.tenantService.getTenants<Tenant>(this.pageRequest);
        this.tenants = tenant.data;
      } catch (error) {
      }

    }
  }
}
