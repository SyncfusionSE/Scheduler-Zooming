import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import the ScheduleModule for the Schedule component
import { ScheduleAllModule } from '@syncfusion/ej2-angular-schedule';
import { ButtonAllModule } from '@syncfusion/ej2-angular-buttons';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ScheduleAllModule,
    ButtonAllModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
