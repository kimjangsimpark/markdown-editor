import { Component, CustomElement } from '../../../engines/component';
import { CalendarService, Schedule } from '../../../service/calendar.service';
import template from './schedule-week-container.component.html';
import style from './schedule-week-container.component.scss';

export class ScheduleViewModel {
  private _top = 0;
  private _left = 0;
  private _width = 0;
  private _height = 0;
  private _startDate: Date;
  private _endDate: Date;

  constructor(private _model: Schedule) {
    this._startDate = new Date(this._model.startDate.getTime());
    this._endDate = new Date(this._model.endDate.getTime());
  }

  get getDuration(): number {
    return this.endDate.getTime() - this.startDate.getTime();
  }

  get top(): number {
    return this._top;
  }

  set top(value: number) {
    this._top = value;
  }

  get left(): number {
    return this._left;
  }

  set left(value: number) {
    this._left = value;
  }

  get width(): number {
    return this._width;
  }

  set width(value: number) {
    this._width = value;
  }

  get height(): number {
    return this._height;
  }

  set height(value: number) {
    this._height = value;
  }

  get startDate(): Date {
    return this._startDate;
  }

  set startDate(value: Date) {
    this._startDate = value;
  }

  get endDate(): Date {
    return this._endDate;
  }

  set endDate(value: Date) {
    this._endDate = value;
  }

  get model(): Schedule {
    return this._model;
  }

  set model(value: Schedule) {
    this._model = value;
  }
}

enum UnitsForSchedule {
  week = 7,
}

@Component({
  selector: 'schedule-week-container',
  template: template,
  style: style,
})
export class ScheduleWeekContainerComponent extends CustomElement {
  private startDate: Date;
  private endDate: Date;
  private scheduleVMList: ScheduleViewModel[];

  public constructor(
    private readonly calendarService: CalendarService,
    private readonly index: number
  ) {
    super();
    this.calendarService.selectedYearAndMonth.subscribe(this.getSubscriber());
    this.calendarService.selectedMonthSchedules.subscribe((scheduleList) => {
      console.log('받은스케줄', scheduleList);
      this.scheduleVMList = scheduleList.reduce((result, schedule) => {
        if (
          schedule.startDate < this.startDate &&
          schedule.endDate > this.endDate
        ) {
          result.push(new ScheduleViewModel(schedule));
        }
        return [...result];
      }, new Array<ScheduleViewModel>());

      console.log(` ${index} :스켇쥴리스트`, this.scheduleVMList);
      this.scheduleVMList.forEach((schedule) => {
        console.log('duration', schedule.getDuration);
      });
    });
  }

  private getSubscriber(): (date: Date) => void {
    const getSelectedFirstDay = (): number => {
      return this.calendarService.getSelectedFirstDay();
    };

    const getAxisDate = (date: Date) => {
      const axisDate = new Date(date.getTime());
      axisDate.setDate(1);
      axisDate.setDate(-getSelectedFirstDay.call(this) + 1);
      return axisDate;
    };

    return (date) => {
      this.startDate = new Date(getAxisDate(date).getTime());
      this.startDate.setDate(
        getAxisDate(date).getDate() + UnitsForSchedule.week * this.index
      );
      this.endDate = new Date(getAxisDate(date).getTime());
      this.endDate.setDate(
        getAxisDate(date).getDate() +
          UnitsForSchedule.week * (this.index + 1) -
          1
      );
      console.log('스타트데이트:', this.startDate);
      console.log('엔드데이트22:', this.endDate);
    };
  }
}
