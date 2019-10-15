import { Component, OnInit } from '@angular/core';
import {
  MatDialog,
  MatTableDataSource,
  PageEvent,
  MatSelectChange
} from '@angular/material';
import { PageRequest, Room } from '@gmrc/models';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Router } from '@angular/router';
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  constructor(
    private router: Router
  ) {}
  ngOnInit() {
  }

}
