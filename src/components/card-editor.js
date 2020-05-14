import {DAYS, COLORS, REDACTOR_STATES, CARD_CLASS} from '../const.js';
import {formatTime, formatDate, isRepeating, checkDate} from '../utils/common.js';
import AbstractSmartComponent from './abstract-smart-component.js';
import flatpickr from "flatpickr";
import he from "he";

import "flatpickr/dist/flatpickr.min.css";


const DESCRIPTION_LENGTH = {
  MIN: 1,
  MAX: 140,
};

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

const createCardEditorTemplate = (task, options = {}) => {

  const {isDateShowing, isRepeatTask, color, repeatDays, description, dueDate, isAllDisabled} = options;

  const isShowDate = isRepeatTask ? false : isDateShowing;
  let isDateExist; let isExpired; let dateFieldText; let timeFieldText;

  if (isShowDate) {
    isDateExist = !!dueDate;

    isExpired = isDateExist ? checkDate(dueDate) : null;
    dateFieldText = isDateExist ? formatDate(dueDate) : ``;
    timeFieldText = isDateExist ? `${formatTime(dueDate)}` : ``;
  }

  const disableControl = isAllDisabled ? `disabled` : ``;

  const isValidDescription = description.length >= DESCRIPTION_LENGTH.MIN;

  const isSaveButtonDisabled = !isValidDescription || (isRepeatTask && !isRepeating(repeatDays)) || isAllDisabled;


  const repeatClass = isRepeatTask ? CARD_CLASS.REPEAT : ``;
  const deadlineClass = isExpired ? CARD_CLASS.DEADLINE : ``;

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
      <form class="card__form" method="get" ${disableControl}>
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
                maxlength="${DESCRIPTION_LENGTH.MAX}"
                 ${disableControl}
              >${description}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button" ${disableControl}>
                  date: <span class="card__date-status">${isShowDate ? `yes` : `no`}</span>
                </button>
                ${
    isShowDate ?
      `<fieldset class="card__date-deadline" ${disableControl}>
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      placeholder=""
                      name="date"
                      value="${dateFieldText} ${timeFieldText}"
                    />
                  </label>
                </fieldset>`
      : ``
    }

                <button class="card__repeat-toggle" type="button" ${disableControl}>
                  repeat:<span class="card__repeat-status">${isRepeatTask ? `yes` : `no`}</span>
                </button>
                ${isRepeatTask ?
      `<fieldset class="card__repeat-days" ${disableControl}>
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
            <button class="card__delete" type="button" ${disableControl}>delete</button>
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
    this._isDateShowing = !!task.dueDate;
    this._currentDate = task.dueDate;
    this._isRepeat = isRepeating(task.repeatDays);
    this._currentColor = task.color;
    this._currentRepeatDays = Object.assign({}, task.repeatDays);
    this._description = task.description;

    this._isAllDisabled = false;
    this._submitHandler = null;
    this._deleteHandler = null;

    this._flatpickr = null;

    this._applyFlatpickr();
    this.recoveryListeners();
  }

  _setDateClickHandler() {
    this.getElement().querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, () => {
      this._isDateShowing = !this._isDateShowing;
      this._currentDate = new Date();
      this.rerender();
    });
  }

  _setDateChangeHandler() {
    const control = this.getElement().querySelector(`.card__date`);

    if (control) {
      control.addEventListener(`change`, (evt) => {
        this._currentDate = new Date(evt.target.value);
        this.rerender();
      });
    }
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

  _setTextChangeHandler() {
    const control = this.getElement().querySelector(`.card__text`);

    control.addEventListener(`change`, (evt) => {
      const description = he.encode(evt.target.value);
      this._description = description;
      this.rerender();
    });
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    if (this._isDateShowing) {
      const inputDate = this.getElement().querySelector(`.card__date`);
      const options = {
        altInput: true,
        allowInput: true,
        defaultDate: this._currentDate || `today`,
      };

      if (inputDate) {
        this._flatpickr = flatpickr(inputDate, options);
      }
    }
  }

  getTemplate() {
    const options = {
      isDateShowing: this._isDateShowing,
      isRepeatTask: this._isRepeat,
      color: this._currentColor,
      repeatDays: this._currentRepeatDays,
      description: this._description,
      dueDate: this._currentDate,
      isAllDisabled: this._isAllDisabled,
    };

    return createCardEditorTemplate(this._task, options);
  }

  reset() {
    this._isDateShowing = !!this._task.dueDate;
    this._currentDate = this._task.dueDate;
    this._isRepeat = isRepeating(this._task.repeatDays);
    this._currentColor = this._task.color;
    this._currentRepeatDays = Object.assign({}, this._task.repeatDays);
    this._description = this._task.description;
    this._isAllDisabled = false;

    this.rerender();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  setSubmitHandler(cb) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, cb);
    this._submitHandler = cb;
  }

  setDeleteHandler(cb) {
    this.getElement().querySelector(`.card__delete`).addEventListener(`click`, cb);
    this._deleteHandler = cb;
  }

  recoveryListeners() {
    this._setDateClickHandler();
    this._setDateChangeHandler();
    this._setRepeatClickHandler();
    this._setColorClickHandler();
    this._setRepeatChangeHandler();
    this._setTextChangeHandler();
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteHandler(this._deleteHandler);
  }

  disableForm(state) {
    this._isAllDisabled = true;
    this.rerender();

    switch (state) {
      case REDACTOR_STATES.SAVE:
        const saveButton = this.getElement().querySelector(`.card__save`);
        saveButton.textContent = state;
        break;

      case REDACTOR_STATES.DELETE:
        const deleteButton = this.getElement().querySelector(`.card__delete`);
        deleteButton.textContent = state;
        break;
    }
  }

  shake() {
    this.getElement().classList.add(`shake`);
  }
}

export default CardEditor;
