import CardEditorComponent from '../components/card-editor.js';
import CardComponent from '../components/card.js';

import {render, replace, removeComponent} from '../utils/render.js';

import {DAYS} from '../const.js';

const PRESS_KEY = {
  ESC: 27,
};

const EDITOR_STATUS = {
  OPENED: `opened`,
  CLOSED: `closed`,
};

const parseForm = (form) => {
  const formData = new FormData(form);

  const repeatDaysContainer = form.querySelector(`.card__repeat-days`);
  let repeatDaysObj = {};

  DAYS.forEach((day) => {
    repeatDaysObj[day] = false;
  });

  if (repeatDaysContainer) {
    const inputDays = Array.from(repeatDaysContainer.querySelectorAll(`input`));

    repeatDaysObj = DAYS.reduce((obj, day, index) => {
      obj[day] = inputDays[index].checked;
      return obj;
    }, {});
  }

  const date = formData.get(`date`);

  const newTask = {
    description: formData.get(`text`),
    color: formData.get(`color`),
    dueDate: date ? new Date(date) : null,
    repeatDays: repeatDaysObj,
  };

  return newTask;
};

class CardController {
  constructor(container, onDataChange, onViewChange, onDataDelete, onDataAdd) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onDataDelete = onDataDelete;
    this._onDataAdd = onDataAdd;
    this._editorStatus = EDITOR_STATUS.CLOSED;
    this._isEmptyCard = false;

    this._cardComponent = null;
    this._cardEditorComponent = null;

    this._onEscPress = this._onEscPress.bind(this);
    this.onCreatingCard = this.onCreatingCard.bind(this);
  }

  _onEscPress(evt) {
    const isEscPress = evt.keyCode === PRESS_KEY.ESC;

    if (isEscPress) {
      this._closeEditor(evt);
    }
  }

  _openEditor() {
    this._editorStatus = EDITOR_STATUS.OPENED;
    replace(this._cardEditorComponent, this._cardComponent);
    document.addEventListener(`keydown`, this._onEscPress);
  }

  _closeEditor(evt) {
    evt.preventDefault();
    if (this._editorStatus === EDITOR_STATUS.OPENED) {
      this._cardEditorComponent.reset();
      replace(this._cardComponent, this._cardEditorComponent);
      document.removeEventListener(`keydown`, this._onEscPress);
      this._editorStatus = EDITOR_STATUS.CLOSED;

      if (this._isEmptyCard) {
        this.destroy();
      }
    }
  }

  _changeCardState(property, task) {
    const changedTask = {[property]: !task[property]};

    const newTask = Object.assign({}, task, changedTask);

    this._onDataChange(newTask);
  }

  _deleteCard() {
    this._onDataDelete(this.getId());
  }

  _changeCard(task) {
    const form = this._cardEditorComponent.getElement().querySelector(`.card__form`);
    const changedTask = parseForm(form);

    const newTask = Object.assign({}, task, changedTask);
    this._onDataChange(newTask);
  }

  _addCard(task) {
    const form = this._cardEditorComponent.getElement().querySelector(`.card__form`);
    const changedTask = parseForm(form);

    const newTask = Object.assign({}, task, changedTask);
    this._onDataAdd(newTask);
  }

  _recoveryListeners(task) {
    const onEditClick = (evt) => {
      evt.preventDefault();
      this._onViewChange(evt);
      this._openEditor();
    };

    const onFormSubmit = () => {
      if (this._isEmptyCard) {
        this._addCard(task);
      } else {
        this._changeCard(task);
      }
    };
    const onCardDelete = (evt) => this._deleteCard(evt);

    this._cardComponent.setEditClickHandler(onEditClick);

    this._cardComponent.setArchiveClickHandler(() => this._changeCardState(`isArchive`, task));

    this._cardComponent.setFavoritesClickHandler(() => this._changeCardState(`isFavorite`, task));

    this._cardEditorComponent.setSubmitHandler(onFormSubmit);

    this._cardEditorComponent.setDeleteHandler(onCardDelete);
  }

  render(task) {
    this._cardComponent = new CardComponent(task);
    this._cardEditorComponent = new CardEditorComponent(task);
    render(this._container, this._cardComponent);

    this._recoveryListeners(task);
  }

  setDefaultView(evt) {
    this._closeEditor(evt);
  }

  getId() {
    return this._cardComponent.getTask().id;
  }

  updateRender(task) {
    const updatedCardComponent = new CardComponent(task);
    this._cardEditorComponent = new CardEditorComponent(task);
    replace(updatedCardComponent, this._cardComponent);
    this._cardComponent = updatedCardComponent;

    this._recoveryListeners(task);
  }

  destroy() {
    removeComponent(this._cardComponent);
    removeComponent(this._cardEditorComponent);
  }

  onCreatingCard(evt) {
    evt.preventDefault();
    this._onViewChange(evt);
    this._openEditor();
    this._isEmptyCard = true;
  }

  disableForm(state) {
    this._cardEditorComponent.disableForm(state);
  }

  onError() {
    this._cardEditorComponent.reset();
    this._cardEditorComponent.shake();
  }

  setIsEmptyCard(boolean) {
    this._isEmptyCard = boolean;
  }
}

export default CardController;
