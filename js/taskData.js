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


/**
 * Saves a new task in Firebase.
 * Without status the task starts in "todo", without priority it is "medium".
 * @param {Task} task - The new task without id.
 * @returns {Promise<Task>} The saved task with the new id.
 */
async function addTask(task) {
    const newTask = removeId(task);
    if (!newTask.status) newTask.status = TASK_STATUS.todo;
    if (!newTask.priority) newTask.priority = TASK_PRIORITY.medium;
    const result = await postData('tasks', newTask);
    newTask.id = result.name;
    return fillTaskDefaults(newTask);
}


/**
 * Changes only the given fields of a task, e.g. { status: TASK_STATUS.done }.
 * Arrays like subtasks are always sent complete.
 * @param {string} id - The id of the task.
 * @param {Object} changes - The fields to change.
 */
async function updateTask(id, changes) {
    await patchData('tasks/' + id, removeId(changes));
}


/**
 * Deletes a task.
 * @param {string} id - The id of the task.
 */
async function deleteTask(id) {
    await deleteData('tasks/' + id);
}


