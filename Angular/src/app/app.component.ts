import { Component, ViewChild } from '@angular/core';
import { extend, Internationalization } from '@syncfusion/ej2-base';
import {
  ScheduleComponent,
  EventSettingsModel,
  DayService,
  WeekService,
  WorkWeekService,
  MonthService,
  AgendaService,
  ResizeService,
  DragAndDropService,
  View,
  ViewsModel
} from '@syncfusion/ej2-angular-schedule';
import { scheduleData } from './data';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  providers: [
    DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    AgendaService,
    ResizeService,
    DragAndDropService,
  ],
})
export class AppComponent {
  @ViewChild('schedule', { static: true })
  public scheduleObj: ScheduleComponent;
  public selectedDate: Date = new Date(2021, 0, 10);
  public eventSettings: EventSettingsModel = {
    dataSource: extend([], scheduleData, null, true) as Record<string, any>[],
  };
  public instance: Internationalization = new Internationalization();
  public dayInterval: number = 4;
  public weekInterval: number = 2;
  public weekTemp: boolean = true;
  public dayTemp: boolean = true;
  public temp: number = 1;

  getMajorTime(date: Date): string {
    return this.instance.formatDate(date, { skeleton: 'hm' });
  }
  getMinorTime(date: Date): string {
    return this.instance.formatDate(date, { skeleton: 'Hms' });
  }
  onZoomIn(): void {
    let currentView: View = this.scheduleObj.currentView;

    if (currentView == 'TimelineWeek') {
      if (this.weekTemp) {
        let currentDate: Date = this.calculateDate();
        this.scheduleObj.selectedDate = currentDate;
        (this.scheduleObj.views[1] as ViewsModel).interval = 1;
        this.scheduleObj.timeScale.slotCount = this.scheduleObj.timeScale.slotCount + 1;
        this.scheduleObj.refresh();
        this.weekTemp = false;
      } else {
        if (this.scheduleObj.timeScale.slotCount < 4) {
          let currentDate: Date = this.calculateDate();
          this.scheduleObj.selectedDate = currentDate;
          this.scheduleObj.timeScale.slotCount =
            this.scheduleObj.timeScale.slotCount + 2;
        } else {
          let currentDate: Date = this.calculateDate();
          this.scheduleObj.changeCurrentView('TimelineDay');
          this.scheduleObj.selectedDate = currentDate;
          this.scheduleObj.timeScale.interval = 60;
          this.scheduleObj.timeScale.slotCount = 1;
        }
      }
    } else if (currentView == 'TimelineDay') {
      if (this.dayTemp) {
        let currentDate: Date = this.calculateDate();
        this.scheduleObj.selectedDate = currentDate;
        (this.scheduleObj.views[0] as ViewsModel).interval = 1;
        this.scheduleObj.timeScale.slotCount =
          this.scheduleObj.timeScale.slotCount + 5;
        this.scheduleObj.refresh();
        this.dayTemp = false;
      } else {
        if (this.scheduleObj.timeScale.slotCount < 120) {
          let currentDate: Date = this.calculateDate();
          this.scheduleObj.selectedDate = currentDate;
          this.scheduleObj.timeScale.slotCount = 30 * this.temp;
          this.temp++;
          this.scheduleObj.refresh();
          this.scheduleObj.scrollTo("00:00", currentDate);
        }
      }
    } else {
      let currentDate: Date = this.calculateDate();
      this.scheduleObj.selectedDate = currentDate;
      this.scheduleObj.timeScale.slotCount = 1;
      this.scheduleObj.changeCurrentView('TimelineWeek');
      this.scheduleObj.refreshEvents();
    }
  }
  onZoomOut(): void {
    let currentView: View = this.scheduleObj.currentView;

    debugger
    if (currentView == 'TimelineWeek') {
      if (this.scheduleObj.timeScale.slotCount > 2) {
        let currentDate: Date = this.calculateDate();
        this.scheduleObj.selectedDate = currentDate;
        this.scheduleObj.scrollTo("00:00", currentDate);
        this.scheduleObj.timeScale.slotCount =
          this.scheduleObj.timeScale.slotCount - 2;
      } else {
        let currentDate: Date = this.calculateDate();
        this.scheduleObj.selectedDate = currentDate;
        this.scheduleObj.changeCurrentView('TimelineMonth');
        this.weekTemp = true;
      }
    } else if (currentView == 'TimelineDay') {
      if (this.scheduleObj.timeScale.slotCount > 30) {
        let currentDate: Date = this.calculateDate();
        this.scheduleObj.scrollTo("00:00", currentDate);
        this.scheduleObj.timeScale.slotCount =
          this.scheduleObj.timeScale.slotCount - 30;
      } else if (this.scheduleObj.timeScale.slotCount == 30) {
        let currentDate: Date = this.calculateDate();
        this.scheduleObj.scrollTo("00:00", currentDate);
        this.scheduleObj.timeScale.slotCount = 6;
      } else {
        let currentDate: Date = this.calculateDate();
        this.scheduleObj.changeCurrentView('TimelineWeek');
        this.scheduleObj.selectedDate = currentDate;
        this.scheduleObj.scrollTo("00:00", currentDate);
        this.scheduleObj.timeScale.interval = 60;
        this.scheduleObj.timeScale.slotCount = 4;
        this.dayTemp = true;
        this.temp = 1;
      }
    }
  }
  calculateDate() {
    var scrollLeft = this.scheduleObj.element.querySelector(".e-content-wrap").scrollLeft;
    var headerCellIndex = scrollLeft / (this.scheduleObj.element.querySelectorAll(".e-header-cells")[0] as HTMLElement).offsetWidth;
    var currentHeaderCell = this.scheduleObj.element.querySelectorAll(".e-header-cells")[Math.floor(headerCellIndex)];
    var currentViewDate = currentHeaderCell.getAttribute("data-date");
    return new Date(parseInt(currentViewDate));
  }
}
