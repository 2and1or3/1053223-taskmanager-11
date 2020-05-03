import MenuComponent from './components/menu.js';

import BoardController from './controllers/board-controller.js';
import FiltersController from './controllers/filters-controller.js';

import TasksModel from './models/tasks.js';

import {render} from './utils/render.js';
import {tasksData} from './mock/task.js';


const main = document.querySelector(`.main`);
const mainControl = main.querySelector(`.control`);


const menuComponent = new MenuComponent();
render(mainControl, menuComponent);


const tasksModel = new TasksModel();
tasksModel.setTasks(tasksData);

const filtersController = new FiltersController(main, tasksModel);
filtersController.render();


const boardController = new BoardController(main, tasksModel);
boardController.render();

menuComponent.setNewTaskHandler(boardController.createCard);
