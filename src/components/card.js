import {MONTH_NAMES} from '../const.js';
import {formatTime, checkDate} from '../utils.js';
import AbstractComponent from './abstract-component.js';

const BUTTON_NAMES = {
  EDIT: `edit`,
  ARCHIVE: `archive`,
  FAVORITES: `favorites`,
};

const createButtonMarkup = (name, isActive) => {
  const activeClass = isActive ? `` : `card__btn--disabled`;

  return (
    `<button type="button" class="card__btn card__btn--${name} ${activeClass}">
      ${name}
    </button>`
  );
};

const createCardTemplate = function (task) {
  const {color, description, dueDate, repeatDays, isArchive, isFavorite} = task;

  const isExpired = checkDate(dueDate);
  const isDateShowing = !!dueDate;

  const date = isDateShowing ? `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}` : ``;
  const time = isDateShowing ? `${formatTime(dueDate)}` : ``;

  const isRepeats = Object.values(repeatDays).some(Boolean);
  const repeatClass = isRepeats ? `card--repeat` : ``;

  const deadlineClass = isExpired ? `card--deadline` : ``;
  const buttonEdit = createButtonMarkup(BUTTON_NAMES.EDIT, true);
  const buttonArchive = createButtonMarkup(BUTTON_NAMES.ARCHIVE, !isArchive);
  const buttonFavorite = createButtonMarkup(BUTTON_NAMES.FAVORITES, !isFavorite);

  return (
    `<article class="card card--${color} ${repeatClass} ${deadlineClass}">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            ${buttonEdit}
            ${buttonArchive}
            ${buttonFavorite}
          </div>

          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <p class="card__text">${description}</p>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <div class="card__date-deadline">
                  <p class="card__input-deadline-wrap">
                    <span class="card__date">${date}</span>
                    <span class="card__time">${time}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>`
  );
};

class Card extends AbstractComponent {
  constructor(task) {
    super();
    this._task = task;
  }

  getTemplate() {
    return createCardTemplate(this._task);
  }

  getTask() {
    return this._task;
  }

  setEditClickHandler(cb) {
    this.getElement().querySelector(`.card__btn--${BUTTON_NAMES.EDIT}`).addEventListener(`click`, cb);
  }

  setArchiveClickHandler(cb) {
    this.getElement().querySelector(`.card__btn--${BUTTON_NAMES.ARCHIVE}`).addEventListener(`click`, cb);
  }

  setFavoritesClickHandler(cb) {
    this.getElement().querySelector(`.card__btn--${BUTTON_NAMES.FAVORITES}`).addEventListener(`click`, cb);
  }
}

export default Card;
