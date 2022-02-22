
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ScheduleComponent, Day, Week, Month, Inject, ViewsDirective, HeaderRowsDirective, HeaderRowDirective, ViewDirective, TimelineViews, TimelineMonth } from '@syncfusion/ej2-react-schedule';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { scheduleData } from './datasource';
import './App.css';
import { extend, Internationalization } from '@syncfusion/ej2-base';
class App extends React.Component {
    constructor() {
        super(...arguments);
        this.data = extend([], scheduleData, null, true);
        this.instance = new Internationalization();
        this.weekTemp = true;
        this.dayTemp = true;
        this.temp = 1;
    }
    zoominHandler() {
      var currentView = this.scheduleObj.currentView;
      var currentDate = this.calculateDate();
      if (currentView === 'TimelineWeek') {
          if (this.weekTemp) {
              this.scheduleObj.selectedDate = currentDate;
              this.scheduleObj.views[1].interval = 1;
              this.scheduleObj.timeScale.slotCount = this.scheduleObj.timeScale.slotCount + 1;
              this.scheduleObj.refresh();
              this.weekTemp = false;
          }
          else {
              if (this.scheduleObj.timeScale.slotCount < 4) {
                  //var currentDate = this.calculateDate();
                  this.scheduleObj.selectedDate = currentDate;
                  this.scheduleObj.timeScale.slotCount = this.scheduleObj.timeScale.slotCount + 2;
              }
              else {
                  //var currentDate = this.calculateDate();
                  this.scheduleObj.changeCurrentView('TimelineDay');
                  this.scheduleObj.selectedDate = currentDate;
                  this.scheduleObj.timeScale.interval = 60;
                  this.scheduleObj.timeScale.slotCount = 1;
              }
          }
      }
      else if (currentView === 'TimelineDay') {
          if (this.dayTemp) {
              //var currentDate = this.calculateDate();
              this.scheduleObj.selectedDate = currentDate;
              this.scheduleObj.views[0].interval = 1;
              this.scheduleObj.timeScale.slotCount =
                  this.scheduleObj.timeScale.slotCount + 5;
              this.scheduleObj.refresh();
              this.dayTemp = false;
          }
          else {
              if (this.scheduleObj.timeScale.slotCount < 120) {
                  //var currentDate = this.calculateDate();
                  this.scheduleObj.selectedDate = currentDate;
                  this.scheduleObj.timeScale.slotCount = 30 * this.temp;
                  this.temp++;
                  this.scheduleObj.refresh();
                  this.scheduleObj.scrollTo("00:00", currentDate);
              }
          }
      }
      else {
          //var currentDate = this.calculateDate();
          this.scheduleObj.selectedDate = currentDate;
          this.scheduleObj.timeScale.slotCount = 1;
          this.scheduleObj.changeCurrentView('TimelineWeek');
          this.scheduleObj.refreshEvents();
      }
    }
    zoomoutHandler() {
      var currentView = this.scheduleObj.currentView;
      var currentDate = this.calculateDate();
      if (currentView === 'TimelineWeek') {
          if (this.scheduleObj.timeScale.slotCount > 2) {
              //var currentDate = this.calculateDate();
              this.scheduleObj.selectedDate = currentDate;
              this.scheduleObj.scrollTo("00:00", currentDate);
              this.scheduleObj.timeScale.slotCount =
                  this.scheduleObj.timeScale.slotCount - 2;
          }
          else {
              //var currentDate = this.calculateDate();
              this.scheduleObj.selectedDate = currentDate;
              this.scheduleObj.changeCurrentView('TimelineMonth');
              this.weekTemp = true;
          }
      }
      else if (currentView === 'TimelineDay') {
          if (this.scheduleObj.timeScale.slotCount > 30) {
              //var currentDate = this.calculateDate();
              this.scheduleObj.scrollTo("00:00", currentDate);
              this.scheduleObj.timeScale.slotCount =
                  this.scheduleObj.timeScale.slotCount - 30;
          }
          else if (this.scheduleObj.timeScale.slotCount === 30) {
              //var currentDate = this.calculateDate();
              this.scheduleObj.scrollTo("00:00", currentDate);
              this.scheduleObj.timeScale.slotCount = 6;
          }
          else {
              //var currentDate = this.calculateDate();
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
      var headerCellIndex = scrollLeft / this.scheduleObj.element.querySelectorAll(".e-header-cells")[0].offsetWidth;
      var currentHeaderCell = this.scheduleObj.element.querySelectorAll(".e-header-cells")[Math.floor(headerCellIndex)];
      var currentViewDate = currentHeaderCell.getAttribute("data-date");
      return new Date(parseInt(currentViewDate));
  }
    majorSlotTemplate(props) {
      return (<div>{this.instance.formatDate(props.date, { skeleton: 'hm' })}</div>);
    }
    minorSlotTemplate(props) {
      return (<div>{this.instance.formatDate(props.date, { skeleton: 'Hms' })}</div>);
    }
    render() {
        return(<div>
          <ButtonComponent onClick={this.zoominHandler.bind(this)}>Zoom In</ButtonComponent>
          <ButtonComponent onClick={this.zoomoutHandler.bind(this)}>Zoom Out</ButtonComponent>
          <br />
          <br />
          <ScheduleComponent ref={schedule => this.scheduleObj = schedule} width='100%' height='550px' selectedDate={new Date(2021, 0, 10)} cssClass= 'schedule-cell-dimension' 
              currentView="TimelineMonth" eventSettings={{ dataSource: this.data }} timeScale={{ majorSlotTemplate: this.majorSlotTemplate.bind(this),
                minorSlotTemplate: this.minorSlotTemplate.bind(this) }}>
            <ViewsDirective>
              <ViewDirective option='TimelineDay' interval={4} />
              <ViewDirective option='TimelineWeek' interval={2} />
              <ViewDirective option='TimelineMonth'/>
            </ViewsDirective>
            <HeaderRowsDirective>
              <HeaderRowDirective option='Month'/>
              <HeaderRowDirective option='Date'/>
              <HeaderRowDirective option='Hour'/>
            </HeaderRowsDirective>
            <Inject services={[Day, Week, Month, TimelineViews, TimelineMonth]}/>
          </ScheduleComponent>
        </div>);    
    }
}
;
ReactDOM.render(<App />, document.getElementById('schedule'));
