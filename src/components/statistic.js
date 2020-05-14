import AbstractComponent from './abstract-component';

import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css";
import moment from 'moment';

import {COLORS} from '../const.js';

const FLATPICKR_FORMAT = `YYYY-MM-DD`;
const LENGTH_PERIOD = 6;
const RANGE_SIGN = `to`;

const parseRangeByFormat = (range, format) => {
  const isRange = range.indexOf(RANGE_SIGN);

  if (~isRange) {
    const parsedRange = {
      from: range.slice(0, format.length),
      to: range.slice(-format.length, range.length),
    };

    return parsedRange;
  }

  return false;
};


const createStatisticTemplate = () => {

  return (
    `<section class="statistic container">
      <div class="statistic__line">
        <div class="statistic__period">
          <h2 class="statistic__period-title">Task Activity DIAGRAM</h2>

          <div class="statistic-input-wrap">
            <input
              class="statistic__period-input"
              type="text"
              placeholder="01 Feb - 08 Feb"
            />
          </div>

          <p class="statistic__period-result">
            In total for the specified period
            <span class="statistic__task-found">0</span> tasks were fulfilled.
          </p>
        </div>
        <div class="statistic__line-graphic">
          <canvas class="statistic__days" width="550" height="150"></canvas>
        </div>
      </div>

      <div class="statistic__circle">
        <div class="statistic__colors-wrap">
          <canvas class="statistic__colors" width="400" height="300"></canvas>
        </div>
      </div>
    </section>`
  );
};

class Statistic extends AbstractComponent {
  constructor(tasksModel) {
    super();
    this._tasks = tasksModel.getAllTasks().slice();
    this._dateTo = moment(new Date()).format(FLATPICKR_FORMAT);
    this._dateFrom = moment(this._dateTo)
                      .add(-LENGTH_PERIOD, `days`)
                      .format(FLATPICKR_FORMAT);

    this._daysChart = null;
    this._colorsChart = null;

    this._flatpickr = null;

    this._applyFlatpickr();
    this._onPeriodChange();

    this.update(this._tasks);
  }

  _drawDaysChart(tasksByDay) {
    if (this._daysChart) {
      this._daysChart.destroy();
      this._daysChart = null;
    }

    const ctx = this.getElement().querySelector(`.statistic__days`).getContext(`2d`);

    const titles = Object.keys(tasksByDay);
    const dones = Object.values(tasksByDay);

    const chart = new Chart(ctx, {
      plugins: [ChartDataLabels],
      type: `line`,
      data: {
        labels: titles,
        datasets: [{
          label: `Done by: day`,
          data: dones,
          backgroundColor: `rgba(0, 255, 0, 0.3)`,
        }],
      },
      options: {
        plugins: {
          datalabels: {
            color: `black`,
            font: {
              size: `16`,
            }
          }
        }
      }
    });

    return chart;
  }

  _drawColorsChart(tasksByColor) {
    if (this._colorsChart) {
      this._colorsChart.destroy();
      this._colorsChart = null;
    }

    const ctx = this.getElement().querySelector(`.statistic__colors`).getContext(`2d`);

    const titles = Object.keys(tasksByColor);
    const dones = Object.values(tasksByColor);

    const chart = new Chart(ctx, {
      plugins: [ChartDataLabels],
      type: `pie`,
      data: {
        labels: titles,
        datasets: [{
          label: `Done by: Colors`,
          data: dones,
          backgroundColor: COLORS,
          borderWidth: 2
        }]
      },
      options: {
        legend: {
          labels: {
            fontSize: 18,
            fontColor: `black`
          }
        },
        plugins: {
          datalabels: {
            color: `white`,
            font: {
              size: `18`,
            }
          }
        }
      }
    });

    return chart;
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    const periodControl = this.getElement().querySelector(`.statistic__period-input`);
    const options = {
      altInput: true,
      allowInput: true,
      mode: `range`,
      defaultDate: [this._dateFrom, this._dateTo],
    };

    this._flatpickr = flatpickr(periodControl, options);
  }

  _onPeriodChange() {
    const periodControl = this.getElement().querySelector(`.statistic__period-input`);

    periodControl.addEventListener(`change`, (evt) => {
      const range = parseRangeByFormat(evt.target.value, FLATPICKR_FORMAT);

      if (range) {
        this._dateTo = range.to;
        this._dateFrom = range.from;
        this.renderCharts();
      }
    });
  }

  getTemplate() {
    return createStatisticTemplate();
  }

  renderCharts() {
    const dateFrom = new Date(this._dateFrom);
    const dateTo = new Date(this._dateTo);

    const tasksByRange =
    this._tasks
    .filter((task) => {

      const isDateExist = !!task.dueDate;
      if (isDateExist) {
        const isInRange =
          dateFrom.getDate() <= task.dueDate.getDate() &&
          task.dueDate.getDate() <= dateTo.getDate();

        return isInRange;
      }

      return false;
    });


    const tasksByDay = {};
    const tasksByColor = {};

    for (let i = 0; i <= LENGTH_PERIOD; i++) {
      let currentDay = moment(this._dateFrom).add(i, `days`).format(`DD.MM`);

      let tasksFromDay =
        tasksByRange
        .filter((task) => (moment(task.dueDate).format(`DD.MM`) === currentDay) && task.isArchive);

      tasksByDay[currentDay] = tasksFromDay.length;
    }

    for (let i = 0; i < COLORS.length; i++) {
      let currentColor = COLORS[i];
      let tasksFromColor =
        tasksByRange
        .filter((task) => task.color === currentColor && task.isArchive);

      tasksByColor[currentColor] = tasksFromColor.length;
    }

    this._daysChart = this._drawDaysChart(tasksByDay);
    this._colorsChart = this._drawColorsChart(tasksByColor);
  }

  update(tasks) {
    const isChanged = JSON.stringify(this._tasks) !== JSON.stringify(tasks);

    if (isChanged) {
      this._tasks = tasks.slice();
      this.renderCharts();
    }
  }
}

export default Statistic;
