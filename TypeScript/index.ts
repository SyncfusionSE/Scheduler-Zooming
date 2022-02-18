import { Schedule, Week, Month, TimelineViews, TimelineMonth, View, ViewsModel } from '@syncfusion/ej2-schedule';
import { scheduleData } from './datasource';
import { Button } from '@syncfusion/ej2-buttons';
import { Internationalization } from '@syncfusion/ej2-base';

Schedule.Inject(Week, Month, TimelineViews, TimelineMonth);

let instance: Internationalization = new Internationalization();
(window as TemplateFunction).getMajorTime = (date: Date) => {
    return instance.formatDate(date, { skeleton: 'hm' });
};
(window as TemplateFunction).getMinorTime = (date: Date) => {
    return instance.formatDate(date, { skeleton: 'Hms' });
};
interface TemplateFunction extends Window {
    getMajorTime?: Function;
    getMinorTime?: Function;
};

let weekTemp: boolean = true;
let dayTemp: boolean = true;
let temp: number = 1;

let scheduleObj: Schedule = new Schedule({
    width: '100%',
    height: '550px',
    selectedDate: new Date(2021, 0, 10),
    currentView: 'TimelineMonth',
    cssClass: 'schedule-cell-dimension',
    views: [
        { option: 'TimelineDay', interval: 4 },
        { option: 'TimelineWeek', interval: 2 },
        { option: 'TimelineMonth' }
    ],
    headerRows: [
        { option: 'Month' },
        { option: 'Date' },
        { option: 'Hour' }
    ],
    eventSettings: { dataSource: scheduleData },
    timeScale: {
        majorSlotTemplate: '#majorSlotTemplate',
        minorSlotTemplate: '#minorSlotTemplate'
    },
});
scheduleObj.appendTo('#Schedule');

let zoominBtn: Button = new Button();
zoominBtn.appendTo('#zoomin');

let zoomoutBtn: Button = new Button();
zoomoutBtn.appendTo('#zoomout');

document.getElementById('zoomin').addEventListener('click', () => {
    let currentView: View = scheduleObj.currentView;

    if (currentView == 'TimelineWeek') {
        if (weekTemp) {
            let currentDate: Date = calculateDate();
            scheduleObj.selectedDate = currentDate;
            (scheduleObj.views[1] as ViewsModel).interval = 1;
            scheduleObj.timeScale.slotCount = scheduleObj.timeScale.slotCount + 1;
            scheduleObj.refresh();
            weekTemp = false;
        } else {
            if (scheduleObj.timeScale.slotCount < 4) {
                let currentDate: Date = calculateDate();
                scheduleObj.selectedDate = currentDate;
                scheduleObj.timeScale.slotCount = scheduleObj.timeScale.slotCount + 2;
            } else {
                let currentDate: Date = calculateDate();
                scheduleObj.changeCurrentView('TimelineDay');
                scheduleObj.selectedDate = currentDate;
                scheduleObj.timeScale.interval = 60;
                scheduleObj.timeScale.slotCount = 1;
            }
        }
    } else if (currentView == 'TimelineDay') {
        if (dayTemp) {
            let currentDate: Date = calculateDate();
            scheduleObj.selectedDate = currentDate;
            (scheduleObj.views[0] as ViewsModel).interval = 1;
            scheduleObj.timeScale.slotCount =
                scheduleObj.timeScale.slotCount + 5;
            scheduleObj.refresh();
            dayTemp = false;
        } else {
            if (scheduleObj.timeScale.slotCount < 120) {
                let currentDate: Date = calculateDate();
                scheduleObj.selectedDate = currentDate;
                scheduleObj.timeScale.slotCount = 30 * temp;
                temp++;
                scheduleObj.refresh();
                scheduleObj.scrollTo("00:00", currentDate);
            }
        }
    } else {
        let currentDate: Date = calculateDate();
        scheduleObj.selectedDate = currentDate;
        scheduleObj.timeScale.slotCount = 1;
        scheduleObj.changeCurrentView('TimelineWeek');
        scheduleObj.refreshEvents();
    }
});

document.getElementById('zoomout').addEventListener('click', () => {
    let currentView: View = scheduleObj.currentView;

    if (currentView == 'TimelineWeek') {
        if (scheduleObj.timeScale.slotCount > 2) {
            let currentDate: Date = calculateDate();
            scheduleObj.selectedDate = currentDate;
            scheduleObj.scrollTo("00:00", currentDate);
            scheduleObj.timeScale.slotCount =
                scheduleObj.timeScale.slotCount - 2;
        } else {
            let currentDate: Date = calculateDate();
            scheduleObj.selectedDate = currentDate;
            scheduleObj.changeCurrentView('TimelineMonth');
            weekTemp = true;
        }
    } else if (currentView == 'TimelineDay') {
        if (scheduleObj.timeScale.slotCount > 30) {
            let currentDate: Date = calculateDate();
            scheduleObj.scrollTo("00:00", currentDate);
            scheduleObj.timeScale.slotCount =
                scheduleObj.timeScale.slotCount - 30;
        } else if (scheduleObj.timeScale.slotCount == 30) {
            let currentDate: Date = calculateDate();
            scheduleObj.scrollTo("00:00", currentDate);
            scheduleObj.timeScale.slotCount = 6;
        } else {
            let currentDate: Date = calculateDate();
            scheduleObj.changeCurrentView('TimelineWeek');
            scheduleObj.selectedDate = currentDate;
            scheduleObj.scrollTo("00:00", currentDate);
            scheduleObj.timeScale.interval = 60;
            scheduleObj.timeScale.slotCount = 4;
            dayTemp = true;
            temp = 1;
        }
    }
});

function calculateDate() {
    let scrollLeft = scheduleObj.element.querySelector(".e-content-wrap").scrollLeft;
    let headerCellIndex = scrollLeft / (scheduleObj.element.querySelectorAll(".e-header-cells")[0] as HTMLElement).offsetWidth;
    let currentHeaderCell = scheduleObj.element.querySelectorAll(".e-header-cells")[Math.floor(headerCellIndex)];
    let currentViewDate = currentHeaderCell.getAttribute("data-date");
    return new Date(parseInt(currentViewDate));
}