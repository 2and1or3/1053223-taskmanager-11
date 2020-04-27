import CardEditorComponent from '../components/card-editor.js';
import CardComponent from '../components/card.js';

import {render, replace} from '../utils.js';

const PRESS_KEY = {
  ESC: 27,
};

const EDITOR_STATUS = {
  OPENED: `opened`,
  CLOSED: `closed`,
};


class CardController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._cardComponent = null;
    this._cardEditorComponent = null;
    this._onEscPress = this._onEscPress.bind(this);
    this._editorStatus = EDITOR_STATUS.CLOSED;
  }

  _onEscPress(evt) {
    evt.preventDefault();
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

  _recoveryListeners(task) {
    const onEditClick = (evt) => this._openEditor(evt);
    const onFormSubmit = (evt) => this._closeEditor(evt);

    this._cardComponent.setEditClickHandler(onEditClick);

    this._cardComponent.setArchiveClickHandler(() => {
      const changedTask = {
        isArchive: !task.isArchive,
      };

      const newTask = Object.assign({}, task, changedTask);

      this._onDataChange(task, newTask);
    });

    this._cardComponent.setFavoritesClickHandler(() => {
      const changedTask = {
        isFavorite: !task.isFavorite,
      };

      const newTask = Object.assign({}, task, changedTask);

      this._onDataChange(task, newTask);
    });

    this._cardEditorComponent.setSubmitHandler(onFormSubmit);
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

  getTask() {
    return this._cardComponent.getTask();
  }

  updateRender(task) {
    const updatedCardComponent = new CardComponent(task);
    this._cardEditorComponent = new CardEditorComponent(task);
    replace(updatedCardComponent, this._cardComponent);
    this._cardComponent = updatedCardComponent;

    this._recoveryListeners(task);
  }
}

export default CardController;
