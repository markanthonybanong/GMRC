import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { StartModule } from './start/start.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    StartModule,
    RouterModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
