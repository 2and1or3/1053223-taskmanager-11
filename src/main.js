import MenuComponent from './components/menu.js';
import StatisticComponent from './components/statistic.js';

import BoardController from './controllers/board-controller.js';
import FiltersController from './controllers/filters-controller.js';

import API from './api/index.js';
import Provider from './api/provider.js';
import Store from './api/store.js';
import TasksModel from './models/tasks.js';

import {render} from './utils/render.js';
import {MENU_IDS} from './const.js';

const TOKEN = `Basic eo0w59298asd8as11f7a1a`;

const STORE_PREFIX = `localstorage`;
const STORE_VERSION = `v1`;
const STORE_NAME = STORE_PREFIX + STORE_VERSION;

const OFFLINE_TITLE = `[offline]`;

const onScreenChange = (id) => {
  switch (id) {
    case MENU_IDS.TASKS:
      statisticComponent.hide();
      boardController.show();
      filtersController.resetFilterType();
      break;

    case MENU_IDS.STATISTIC:
      boardController.hide();
      statisticComponent.show();
      statisticComponent.update(tasksModel.getAllTasks());
      statisticComponent.renderCharts();
      filtersController.resetFilterType();
      break;
  }
};


const main = document.querySelector(`.main`);
const mainControl = main.querySelector(`.control`);


const menuComponent = new MenuComponent();

const api = new API(TOKEN);
const storage = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, storage);
const tasksModel = new TasksModel();

const filtersController = new FiltersController(main, tasksModel);
const statisticComponent = new StatisticComponent(tasksModel);
const boardController = new BoardController(main, tasksModel, apiWithProvider);

render(mainControl, menuComponent);
filtersController.render();

boardController.renderStateOnFirstLoad();


apiWithProvider.getTasks()
.then((tasks) => tasksModel.setTasks(tasks))
.then(() => {
  render(main, statisticComponent);
  statisticComponent.hide();

  boardController.render();

  menuComponent.setNewTaskHandler((evt) => {
    filtersController.resetFilterType();
    boardController.createCard(evt);
  });
})
.catch((err) => {
  throw new Error(err);
});

menuComponent.setChangeScreenHandler(onScreenChange);

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`./sw.js`)
  .catch((err) => {
    throw new Error(err);
  });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` ${OFFLINE_TITLE}`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` ${OFFLINE_TITLE}`;
});
