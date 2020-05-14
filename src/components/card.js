import AbstractComponent from './abstract-component.js';

import {formatTime, checkDate, formatDate, isRepeating} from '../utils/common.js';
import {CARD_CLASS} from '../const.js';

const BUTTON_NAMES = {
  EDIT: `edit`,
  ARCHIVE: `archive`,
  FAVORITES: `favorites`,
};

const CARD_STATES = {
  FAVORITE: `Favoriting...`,
  ARCHIVE: `Archiving...`,
};

const createButtonMarkup = (name, isActive) => {
  const activeClass = isActive ? `` : CARD_CLASS.BTN_DISABLED;

  return (
    `<button type="button" class="card__btn card__btn--${name} ${activeClass}">
      ${name}
    </button>`
  );
};

const createCardTemplate = function (task) {
  const {color, description, dueDate, repeatDays, isArchive, isFavorite} = task;

  const isExpired = checkDate(dueDate);
  const deadlineClass = isExpired ? CARD_CLASS.DEADLINE : ``;


  const isDateShowing = !!dueDate;
  const date = isDateShowing ? formatDate(dueDate) : ``;
  const time = isDateShowing ? formatTime(dueDate) : ``;

  const isRepeats = isRepeating(repeatDays);
  const repeatClass = isRepeats ? CARD_CLASS.REPEAT : ``;

  const buttonEdit = createButtonMarkup(BUTTON_NAMES.EDIT, true);
  const buttonArchive = createButtonMarkup(BUTTON_NAMES.ARCHIVE, isArchive);
  const buttonFavorite = createButtonMarkup(BUTTON_NAMES.FAVORITES, isFavorite);

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
    const archiveButton = this.getElement().querySelector(`.card__btn--${BUTTON_NAMES.ARCHIVE}`);

    archiveButton.addEventListener(`click`, (evt) => {
      archiveButton.textContent = CARD_STATES.ARCHIVE;
      cb(evt);
    });
  }

  setFavoritesClickHandler(cb) {
    const favoriteButton = this.getElement().querySelector(`.card__btn--${BUTTON_NAMES.FAVORITES}`);

    favoriteButton.addEventListener(`click`, (evt) => {
      favoriteButton.textContent = CARD_STATES.FAVORITE;
      cb(evt);
    });
  }
}

export default Card;
