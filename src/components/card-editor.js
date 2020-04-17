import {MONTH_NAMES, DAYS, COLORS} from '../const.js';
import {formatTime} from '../utils.js';

const getRepeatDayTemplate = (day, i, isChecked) => {
  return (
    `<input
      class="visually-hidden card__repeat-day-input"
      type="checkbox"
      id="repeat-${day}-${i}"
      name="repeat"
      value="${day}"
      ${isChecked ? `checked` : ``}
    />
    <label class="card__repeat-day" for="repeat-${day}-${i}"
      >${day}</label
    >`);
};

const getColorTemplate = (color, isChecked) => {
  return (
    `<input
          type="radio"
          id="color-${color}-4"
          class="card__color-input card__color-input--${color} visually-hidden"
          name="color"
          value="${color}"
          ${isChecked ? `checked` : ``}
        />
        <label
          for="color-${color}-4"
          class="card__color card__color--${color}"
          >${color}</label
        >`
  );
};

const createCardEditorTemplate = function (task) {
  const {description, dueDate, color, repeatDays} = task;

  const isExpired = dueDate < Date.now();
  const isDateShowing = !!dueDate;

  const date = isDateShowing ? `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}` : ``;
  const time = isDateShowing ? `${formatTime(dueDate)}` : ``;


  const isRepeatTask = Object.values(repeatDays).some(Boolean);
  const repeatClass = isRepeatTask ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;

  const repeatDaysMarkup = DAYS.map((day, i) => {
    return getRepeatDayTemplate(day, i, repeatDays[day]);
  }).join(`\n`);

  const colorsMarkup = COLORS.map((item) => {
    return getColorTemplate(item, item === color);
  }).join(`\n`);


  return (
    `<article class="card card--edit card--${color} ${repeatClass} ${deadlineClass}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${description}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">${isDateShowing ? `yes` : `no`}</span>
                </button>
                ${
    isDateShowing ?
      `<fieldset class="card__date-deadline">
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      placeholder=""
                      name="date"
                      value="${date} ${time}"
                    />
                  </label>
                </fieldset>`
      : ``
    }

                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${isRepeatTask ? `yes` : `no`}</span>
                </button>
                ${isRepeatTask ?
      `<fieldset class="card__repeat-days">
                  <div class="card__repeat-days-inner">
                ${repeatDaysMarkup}
                </div>
              </fieldset>`
      : ``
    }
              </div>
            </div>
            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
            ${colorsMarkup}
            </div>
          </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`
  );
};

export {createCardEditorTemplate};
