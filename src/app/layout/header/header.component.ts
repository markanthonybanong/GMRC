import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

  @Output() sideBarToggle = new EventEmitter<void> ();

  constructor(private breakpointObserver: BreakpointObserver) { }

  toggleSideBar(): void {
    this.sideBarToggle.emit();
  }
  ngOnInit() {
  }

}
