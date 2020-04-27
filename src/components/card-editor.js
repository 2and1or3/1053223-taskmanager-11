import {MONTH_NAMES, DAYS, COLORS} from '../const.js';
import {formatTime} from '../utils.js';
import AbstractSmartComponent from './abstract-smart-component.js';

const isRepeatingTask = (repeatDays) => Object.values(repeatDays).some(Boolean);

const getRepeatDayTemplate = (day, isChecked) => {
  return (
    `<input
      class="visually-hidden card__repeat-day-input"
      type="checkbox"
      id="repeat-${day}-1"
      name="repeat"
      value="${day}"
      ${isChecked ? `checked` : ``}
    />
    <label class="card__repeat-day" for="repeat-${day}-1"
      >${day}</label>`
  );
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
          >${color}</label>`
  );
};

const createCardEditorTemplate = function (task, options = {}) {
  const {description, dueDate} = task;
  const {isDateShowing, isRepeatTask, color, repeatDays} = options;

  const isExpired = dueDate < Date.now();

  const isDateExist = !!dueDate;
  const dateFieldText = isDateExist ? `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}` : ``;
  const timeFieldText = isDateExist ? `${formatTime(dueDate)}` : ``;

  const date = isDateShowing ? `${dateFieldText}` : ``;
  const time = isDateShowing ? `${timeFieldText}` : ``;

  const isSaveButtonDisabled = (isDateShowing && !isDateExist) || (isRepeatTask && !isRepeatingTask(repeatDays));


  const repeatClass = isRepeatTask ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;

  const repeatDaysMarkup =
    DAYS
      .map((day) => getRepeatDayTemplate(day, repeatDays[day]))
      .join(`\n`);

  const colorsMarkup =
    COLORS
      .map((item) => getColorTemplate(item, item === color))
      .join(`\n`);


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
            <button class="card__save" type="submit" ${isSaveButtonDisabled ? `disabled` : ``}>save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`
  );
};

class CardEditor extends AbstractSmartComponent {
  constructor(task) {
    super();
    this._task = task;
    this._submitHandler = null;
    this._isDateShowing = !!task.dueDate;
    this._isRepeat = isRepeatingTask(task.repeatDays);
    this._currentColor = task.color;
    this._currentRepeatDays = Object.assign({}, task.repeatDays);


    this.recoveryListeners();
  }

  _setDateClickHandler() {
    this.getElement().querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, () => {
      this._isDateShowing = !this._isDateShowing;
      this.rerender();
    });
  }

  _setRepeatClickHandler() {
    this.getElement().querySelector(`.card__repeat-toggle`).addEventListener(`click`, () => {
      this._isRepeat = !this._isRepeat;
      this.rerender();
    });
  }

  _setRepeatChangeHandler() {
    const container = this.getElement().querySelector(`.card__repeat-days`);

    if (container) {
      container.addEventListener(`change`, (evt) => {
        this._currentRepeatDays[evt.target.value] = !this._currentRepeatDays[evt.target.value];

        this.rerender();
      });
    }
  }

  _setColorClickHandler() {
    const container = this.getElement().querySelector(`.card__colors-wrap`);
    container.addEventListener(`change`, () => {
      const currentColor = container.querySelector(`input:checked`).value;
      this._currentColor = currentColor;
      this.rerender();
    });
  }

  getTemplate() {
    const options = {
      isDateShowing: this._isDateShowing,
      isRepeatTask: this._isRepeat,
      color: this._currentColor,
      repeatDays: this._currentRepeatDays,
    };

    return createCardEditorTemplate(this._task, options);
  }

  reset() {
    this._isDateShowing = !!this._task.dueDate;
    this._isRepeat = isRepeatingTask(this._task.repeatDays);
    this._currentColor = this._task.color;
    this._currentRepeatDays = Object.assign({}, this._task.repeatDays);

    this.rerender();
  }

  rerender() {
    super.rerender();
  }

  recoveryListeners() {
    this._setDateClickHandler();
    this._setRepeatClickHandler();
    this._setColorClickHandler();
    this._setRepeatChangeHandler();
    this.setSubmitHandler(this._submitHandler);
  }

  setSubmitHandler(cb) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, cb);
    this._submitHandler = cb;
  }
}

export default CardEditor;
