<template>
    <div id='app'>
      <ejs-button v-on:click='zoomin'>Zoom In</ejs-button>
      <ejs-button v-on:click='zoomout'>Zoom Out</ejs-button>
        <ejs-schedule id="zoom" ref='scheduleObj' height='550px' width='100%' :selectedDate='selectedDate' :cssClass='cssClass' :currentView='currentView' :views='views' :eventSettings='eventSettings'
        :headerRows="headerRows" :timeScale="timeScale">
        </ejs-schedule>
    </div>
</template>
<script>
import { ScheduleComponent, TimelineViews, TimelineMonth } from "@syncfusion/ej2-vue-schedule";
import { ButtonComponent } from "@syncfusion/ej2-vue-buttons";
import { scheduleData } from './datasource.js';
import { Internationalization } from '@syncfusion/ej2-base';
import { createApp } from "vue";

const app = createApp();


import '../node_modules/@syncfusion/ej2-base/styles/material.css';
import '../node_modules/@syncfusion/ej2-buttons/styles/material.css';
import '../node_modules/@syncfusion/ej2-calendars/styles/material.css';
import '../node_modules/@syncfusion/ej2-dropdowns/styles/material.css';
import '../node_modules/@syncfusion/ej2-inputs/styles/material.css';
import '../node_modules/@syncfusion/ej2-navigations/styles/material.css';
import '../node_modules/@syncfusion/ej2-popups/styles/material.css';
import '../node_modules/@syncfusion/ej2-vue-schedule/styles/material.css';
// const app = createApp();

   var instance = new Internationalization();
  var majorTemplateVue = app.component('majorSlotTemplate', {
    template: '<div>{{majorSlotTemplate(data.date)}}</div>',
    data: () => ({}),
    methods: {
        majorSlotTemplate: function (date) {
            return instance.formatDate(date, { skeleton: 'hm' });
        }
    }
});
   var minorTemplateVue =  app.component('minorSlotTemplate', {
     template: '<div>{{minorSlotTemplate(data.date)}}</div>',
    data: () => ({}),
    methods: {
        minorSlotTemplate: function (date) {
            return instance.formatDate(date, { skeleton: 'Hms' });
        }
    }
});
var weekTemp = true;
var dayTemp = true;
var temp = 1;

export default {
    name: "App",
    // Declaring component and its directives
    components: {
        'ejs-schedule': ScheduleComponent,
        'ejs-button': ButtonComponent
    },
    // Bound properties declaration
    data() {
        return {
            selectedDate: new Date(2021, 0, 10),
           currentView: 'TimelineMonth',
            views: [
              { option: 'TimelineDay', interval: 4 },
              { option: 'TimelineWeek', interval: 3 },
              { option: 'TimelineMonth'}
            ],
            cssClass: 'schedule-cell-dimension',
        headerRows: [
          { option: 'Month' },
          { option: 'Date' },
          { option: 'Hour' }
        ],
            eventSettings: {
                dataSource: scheduleData
            },
            timeScale: {
                enable: true,
                 majorSlotTemplate: function () {
                    return { template: majorTemplateVue };
                },
                minorSlotTemplate: function () {
                    return { template: minorTemplateVue };
                },
            },
        };
    },
    methods : {
        zoomin: function() {
          var scheduleObj = document.getElementById('zoom').ej2_instances[0];
            var currentView = scheduleObj.currentView;
      var currentDate = this.calculateDate();
      if (currentView === 'TimelineWeek') {
          if (weekTemp) {
              scheduleObj.selectedDate = currentDate;
              scheduleObj.views[1].interval = 1;
              scheduleObj.timeScale.slotCount = scheduleObj.timeScale.slotCount + 1;
              scheduleObj.refresh();
              weekTemp = false;
          }
          else {
              if (scheduleObj.timeScale.slotCount < 4) {
                  scheduleObj.selectedDate = currentDate;
                  scheduleObj.timeScale.slotCount = scheduleObj.timeScale.slotCount + 2;
              }
              else {
                  scheduleObj.changeCurrentView('TimelineDay');
                  scheduleObj.selectedDate = currentDate;
                  scheduleObj.timeScale.interval = 60;
                  scheduleObj.timeScale.slotCount = 1;
              }
          }
      }
      else if (currentView === 'TimelineDay') {
          if (dayTemp) {
              scheduleObj.selectedDate = currentDate;
              scheduleObj.views[0].interval = 1;
              scheduleObj.timeScale.slotCount =
                  scheduleObj.timeScale.slotCount + 5;
              scheduleObj.refresh();
              dayTemp = false;
          }
          else {
              if (scheduleObj.timeScale.slotCount < 120) {
                  scheduleObj.selectedDate = currentDate;
                  scheduleObj.timeScale.slotCount = 30 * temp;
                  temp++;
                  scheduleObj.refresh();
                  scheduleObj.scrollTo("00:00", currentDate);
              }
          }
      }
      else {
          scheduleObj.selectedDate = currentDate;
          scheduleObj.timeScale.slotCount = 1;
          scheduleObj.changeCurrentView('TimelineWeek');
          scheduleObj.refreshEvents();
      }
        },
        zoomout: function() {
          var scheduleObj = document.getElementById('zoom').ej2_instances[0];
            var currentView = scheduleObj.currentView;
      var currentDate = this.calculateDate();
      if (currentView === 'TimelineWeek') {
          if (scheduleObj.timeScale.slotCount > 2) {
              scheduleObj.selectedDate = currentDate;
              scheduleObj.scrollTo("00:00", currentDate);
              scheduleObj.timeScale.slotCount =
                  scheduleObj.timeScale.slotCount - 2;
          }
          else {
              scheduleObj.selectedDate = currentDate;
              scheduleObj.changeCurrentView('TimelineMonth');
              weekTemp = true;
          }
      }
      else if (currentView === 'TimelineDay') {
          if (scheduleObj.timeScale.slotCount > 30) {
              scheduleObj.scrollTo("00:00", currentDate);
              scheduleObj.timeScale.slotCount =
                  scheduleObj.timeScale.slotCount - 30;
          }
          else if (scheduleObj.timeScale.slotCount === 30) {
              scheduleObj.scrollTo("00:00", currentDate);
              scheduleObj.timeScale.slotCount = 6;
          }
          else {
              scheduleObj.changeCurrentView('TimelineWeek');
              scheduleObj.selectedDate = currentDate;
              scheduleObj.scrollTo("00:00", currentDate);
              scheduleObj.timeScale.interval = 60;
              scheduleObj.timeScale.slotCount = 4;
              this.dayTemp = true;
              temp = 1;
          }
      }
        },
        calculateDate: function() {
          var scheduleObj = document.getElementById('zoom').ej2_instances[0];
            var scrollLeft = scheduleObj.element.querySelector(".e-content-wrap").scrollLeft;
      var headerCellIndex = scrollLeft / scheduleObj.element.querySelectorAll(".e-header-cells")[0].offsetWidth;
      var currentHeaderCell = scheduleObj.element.querySelectorAll(".e-header-cells")[Math.floor(headerCellIndex)];
      var currentViewDate = currentHeaderCell.getAttribute("data-date");
      return new Date(parseInt(currentViewDate));
        }
    },
      provide: {
      schedule: [TimelineViews, TimelineMonth]
    }
};
</script>

<style>
        .schedule-cell-dimension.e-schedule .e-timeline-month-view .e-content-wrap table col,
        .schedule-cell-dimension.e-schedule .e-timeline-view .e-content-wrap table col {
            width: 100px;
        }

        .schedule-cell-dimension.e-schedule .e-timeline-view .e-work-cells,
        .schedule-cell-dimension.e-schedule .e-timeline-month-view .e-work-cells {
            height: 600px;
        }
    </style>