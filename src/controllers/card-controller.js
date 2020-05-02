import CardEditorComponent from '../components/card-editor.js';
import CardComponent from '../components/card.js';

import {render, replace, removeComponent} from '../utils/render.js';

import {DAYS} from '../const.js';

const parseForm = (form) => {
  const formData = new FormData(form);

  const repeatDaysContainer = form.querySelector(`.card__repeat-days`);
  let repeatDaysObj = null;

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
    repeatDays: repeatDaysObj ? Object.assign({}, repeatDaysObj) : repeatDaysObj,
  };

  return newTask;
};

const PRESS_KEY = {
  ESC: 27,
};

const EDITOR_STATUS = {
  OPENED: `opened`,
  CLOSED: `closed`,
};


class CardController {
  constructor(container, onDataChange, onViewChange, onDataDelete) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onDataDelete = onDataDelete;
    this._editorStatus = EDITOR_STATUS.CLOSED;

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

  _openEditor(evt) {
    evt.preventDefault();
    this._onViewChange(evt);

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
    }
  }

  _archiveHandler(task) {
    const changedTask = {isArchive: !task.isArchive};

    const newTask = Object.assign({}, task, changedTask);

    this._onDataChange(newTask);
  }

  _favoriteHandler(task) {
    const changedTask = {isFavorite: !task.isFavorite};

    const newTask = Object.assign({}, task, changedTask);

    this._onDataChange(newTask);
  }

  _deleteCard(evt) {
    this._closeEditor(evt);
    this._onDataDelete(this.getId());
  }

  _changeCard(task) {
    const form = this._cardEditorComponent.getElement().querySelector(`.card__form`);
    const changedTask = parseForm(form);

    const newTask = Object.assign({}, task, changedTask);

    this._onDataChange(newTask);
  }

  _recoveryListeners(task) {
    const onEditClick = (evt) => this._openEditor(evt);
    const onFormSubmit = (evt) => {
      this._changeCard(task);
      this._closeEditor(evt);
    };
    const onCardDelete = (evt) => this._deleteCard(evt);

    this._cardComponent.setEditClickHandler(onEditClick);

    this._cardComponent.setArchiveClickHandler(() => this._archiveHandler(task));

    this._cardComponent.setFavoritesClickHandler(() => this._favoriteHandler(task));

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
    this._openEditor(evt);
  }
}

export default CardController;
