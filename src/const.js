const MONTH_NAMES = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`,
];

const DAYS = [`mo`, `tu`, `we`, `th`, `fr`, `sa`, `su`];
const COLORS = [`black`, `green`, `yellow`, `pink`, `blue`];

const FILTER_TYPES = {
  ALL: `all`,
  OVERDUE: `overdue`,
  TODAY: `today`,
  FAVORITES: `favorites`,
  REPEATING: `repeating`,
  ARCHIVE: `archive`,
};

const MENU_IDS = {
  TASKS: `task`,
  STATISTIC: `statistic`,
};

const REDACTOR_STATES = {
  SAVE: `Saving...`,
  DELETE: `Deleting...`,
};

const CARD_CLASS = {
  REPEAT: `card--repeat`,
  DEADLINE: `card--deadline`,
  BTN_DISABLED: `card__btn--disabled`
};

export {MONTH_NAMES, DAYS, COLORS, FILTER_TYPES, MENU_IDS, REDACTOR_STATES, CARD_CLASS};
