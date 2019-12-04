import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
  }
  get tenant(): string {
    return this.route.snapshot.paramMap.get('name');
  }
}
