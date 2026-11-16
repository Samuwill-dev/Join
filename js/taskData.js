const TASK_STATUS = { todo: 'todo', inProgress: 'inProgress', awaitFeedback: 'awaitFeedback', done: 'done' };
const TASK_PRIORITY = { urgent: 'urgent', medium: 'medium', low: 'low' };
const TASK_CATEGORY = { technical: 'technical', userStory: 'userStory' };
const DEMO_DUE_IN_DAYS = 14;


/**
 * @typedef {Object} Subtask
 * @property {string} title - The text of the subtask.
 * @property {boolean} done - True if the subtask is checked.
 */


/**
 * @typedef {Object} Task
 * @property {string} [id] - The Firebase key, missing before the task is saved.
 * @property {string} title - The title of the task.
 * @property {string} [description] - The description of the task.
 * @property {string} dueDate - The due date as "YYYY-MM-DD".
 * @property {string} priority - A value from TASK_PRIORITY.
 * @property {string} category - A value from TASK_CATEGORY.
 * @property {string} status - A value from TASK_STATUS.
 * @property {string[]} assignedTo - The ids of the assigned contacts.
 * @property {Subtask[]} subtasks - The subtasks of the task.
 */


/**
 * Loads all tasks from Firebase.
 * @returns {Promise<Task[]>} All tasks as an array.
 */
async function loadTasks() {
    const data = await getData('tasks');
    const tasks = objectToArray(data);
    const result = [];
    for (const task of tasks) {
        result.push(fillTaskDefaults(task));
    }
    return result;
}


/**
 * Adds empty arrays for "assignedTo" and "subtasks" if they are missing.
 * Workaround: Firebase does not save empty arrays, so they are missing after loading.
 * @param {Object} task - The task from Firebase.
 * @returns {Task} The task with both arrays.
 */
function fillTaskDefaults(task) {
    if (!task.assignedTo) task.assignedTo = [];
    if (!task.subtasks) task.subtasks = [];
    return task;
}

