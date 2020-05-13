

class TaskAdapter {
  constructor(task) {
    this.id = task.id;
    this.color = task.color;
    this.description = task.description;
    this.dueDate = task.due_date ? new Date(task.due_date) : null;
    this.isArchive = task.is_archived;
    this.isFavorite = task.is_favorite;
    this.repeatDays = task.repeating_days;
  }

  static parseTask(task) {
    return new TaskAdapter(task);
  }

  static parseTasks(tasks) {
    return tasks.map((task) => TaskAdapter.parseTask(task));
  }

  static toRAW(task) {
    const rawTask = {
      "id": task.id,
      "color": task.color,
      "description": task.description,
      "due_date": task.dueDate ? task.dueDate.toISOString() : null,
      "is_archived": task.isArchive,
      "is_favorite": task.isFavorite,
      "repeating_days": task.repeatDays,
    };

    return rawTask;
  }
}

export default TaskAdapter;
