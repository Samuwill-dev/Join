
async function addTaskTest() {
    const task = await addDemoTask();
    await renderBoard();
}

let draggedTaskId = null;
let draggedTaskElement = null;
let taskPlaceholder = null;
let boardTasks = [];
let boardUsers = [];

document.addEventListener('DOMContentLoaded', initBoard);

/**
 * Loads the tasks and renders the board.
 * @returns {Promise<void>}
 */
async function initBoard() {
    await renderBoard();
}

/**
 * Loads board data and renders each status column.
 * @returns {Promise<void>}
 */
async function renderBoard() {
    try {
        await loadBoardData();
        Object.values(TASK_STATUS).forEach(renderColumn);
    } catch (error) {
        console.error('Board could not be loaded:', error);
    }
}

/**
 * Loads tasks and users for rendering the board.
 * @returns {Promise<void>}
 */
async function loadBoardData() {
    [boardTasks, boardUsers] = await Promise.all([loadTasks(), loadUsers()]);
}

/**
 * Renders the tasks or empty state for one column.
 * @param {string} status - The task status represented by the column.
 * @returns {void}
 */
function renderColumn(status) {
    const section = document.querySelector(`[data-status="${status}"]`);
    const tasks = getVisibleTasks(status);
    section.innerHTML = tasks.length
        ? tasks.map(createTaskCard).join('')
        : getNoTasksTemplate(getColumnTitle(section));
}

/**
 * Returns tasks matching a column status, sorted by their stored order.
 * @param {string} status - The status to filter by.
 * @returns {Task[]}
 */
function getVisibleTasks(status) {
    return boardTasks.filter(task => (task.status || TASK_STATUS.todo) === status)
        .sort((first, second) => getTaskOrder(first) - getTaskOrder(second));
}

/**
 * Reads the heading text for a task column.
 * @param {HTMLElement} section - The column's task section.
 * @returns {string}
 */
function getColumnTitle(section) {
    return section.closest('.columns').querySelector('.column-head h2').textContent;
}

/**
 * Builds a task card from its prepared display values.
 * @param {Task} task - The task to render.
 * @returns {string}
 */
function createTaskCard(task) {
    return getTaskTemplate(
        task, escapeHtml(task.title), getTaskCategory(task), getTaskDescription(task),
        getTaskSubtasks(task), getAssignedUsers(task)
    );
}

/**
 * Returns the display category for a task.
 * @param {Task} task - The task to display.
 * @returns {string}
 */
function getTaskCategory(task) {
    const technical = task.category === TASK_CATEGORY.technical;
    return getCategoryTemplate(technical ? 'technical' : '', technical ? 'Technical Task' : 'User Story');
}

/**
 * Returns the description markup when a task has a description.
 * @param {Task} task - The task to display.
 * @returns {string}
 */
function getTaskDescription(task) {
    return task.description ? getDescriptionTemplate(escapeHtml(task.description)) : '';
}

/**
 * Calculates and returns a task's subtask progress markup.
 * @param {Task} task - The task whose subtasks are displayed.
 * @returns {string}
 */
function getTaskSubtasks(task) {
    const count = task.subtasks.length;
    if (!count) return '';
    const done = task.subtasks.filter(subtask => subtask.done).length;
    return getSubtaskTemplate(done, count, (done / count) * 100);
}

/**
 * Builds the assigned-user markup for a task.
 * @param {Task} task - The task with assigned user ids.
 * @returns {string}
 */
function getAssignedUsers(task) {
    return task.assignedTo.map(getAssignedUser).join('');
}

/**
 * Builds avatar markup for an assigned user, if found.
 * @param {string} id - The assigned user's id.
 * @returns {string}
 */
function getAssignedUser(id) {
    const user = boardUsers.find(contact => contact.id === id);
    if (!user) return '';
    const initials = user.name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();
    return getAssignedUserTemplate(user.color || '#4589ff', escapeHtml(user.name), initials);
}

/**
 * Escapes text before inserting it into HTML.
 * @param {string} value - The text to escape.
 * @returns {string}
 */
function escapeHtml(value) {
    const element = document.createElement('div');
    element.textContent = value || '';
    return element.innerHTML;
}

/**
 * Initializes dragging for a task and creates its placeholder.
 * @param {DragEvent} event - The browser's drag-start event.
 * @returns {void}
 */
function startDragging(event) {
    draggedTaskId = event.currentTarget.dataset.taskId;
    draggedTaskElement = event.currentTarget;
    draggedTaskElement.classList.add('dragging');
    taskPlaceholder = document.createElement('div');
    taskPlaceholder.className = 'task-placeholder';
    taskPlaceholder.setAttribute('aria-hidden', 'true');
    taskPlaceholder.style.height = `${draggedTaskElement.getBoundingClientRect().height}px`;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', draggedTaskId);
}

/**
 * Allows dropping and moves the insertion placeholder under the pointer.
 * @param {DragEvent} event - The browser's drag-over event.
 * @returns {void}
 */
function allowDrop(event) {
    event.preventDefault();
    if (!taskPlaceholder) return;
    const section = event.currentTarget;
    section.insertBefore(taskPlaceholder, getInsertionTarget(section, event.clientY));
}

/**
 * Finds the task before which the placeholder should be inserted.
 * @param {HTMLElement} section - The destination task section.
 * @param {number} pointerY - The pointer's vertical coordinate.
 * @returns {Element|null}
 */
function getInsertionTarget(section, pointerY) {
    const tasks = [...section.querySelectorAll('.task:not(.dragging)')];
    for (const task of tasks) {
        const bounds = task.getBoundingClientRect();
        if (pointerY < bounds.top + bounds.height / 2) return task;
    }

    return null;
}

/**
 * Saves the dropped task's status and position.
 * @param {DragEvent} event - The browser's drop event.
 * @param {string} status - The destination status.
 * @returns {Promise<void>}
 */
async function saveTaskDrop(event, status) {
    event.preventDefault();
    if (!isValidDrop(status)) return finishDragging();
    try {
        await saveTaskOrderUpdates(getDropOrderUpdates(status));
        await renderBoard();
    } catch (error) {
        console.error('Task position could not be saved:', error);
    } finally {
        finishDragging();
    }
}

/**
 * Checks that the current drop has a valid destination.
 * @param {string} status - The status of the destination section.
 * @returns {boolean}
 */
function isValidDrop(status) {
    return Boolean(draggedTaskId && taskPlaceholder &&
        taskPlaceholder.parentElement?.dataset.status === status);
}

/**
 * Creates order updates for the source and destination columns.
 * @param {string} status - The destination status.
 * @returns {{task: Task, status: string, order: number}[]}
 */
function getDropOrderUpdates(status) {
    const sourceStatus = draggedTaskElement.parentElement.dataset.status;
    const targetTasks = getDropTargetTasks(status);
    const sourceTasks = getOrderedTasks(sourceStatus).filter(task => task.id !== draggedTaskId);
    return [
        ...getStatusOrderUpdates(targetTasks, status),
        ...(sourceStatus === status ? [] : getStatusOrderUpdates(sourceTasks, sourceStatus))
    ].filter(isTaskOrderUpdateNeeded);
}

/**
 * Returns destination tasks with the dragged task at its dropped position.
 * @param {string} status - The destination status.
 * @returns {Task[]}
 */
function getDropTargetTasks(status) {
    const previous = getSiblingTask(taskPlaceholder, 'previousElementSibling');
    const next = getSiblingTask(taskPlaceholder, 'nextElementSibling');
    const tasks = getOrderedTasks(status).filter(task => task.id !== draggedTaskId);
    const index = getTaskInsertionIndex(tasks, previous, next);
    tasks.splice(index, 0, boardTasks.find(task => task.id === draggedTaskId));
    return tasks;
}

/**
 * Determines the insertion index from adjacent tasks.
 * @param {Task[]} tasks - The destination tasks without the dragged task.
 * @param {Element|null} previous - The task before the placeholder.
 * @param {Element|null} next - The task after the placeholder.
 * @returns {number}
 */
function getTaskInsertionIndex(tasks, previous, next) {
    const nextIndex = tasks.findIndex(task => task.id === next?.dataset.taskId);
    if (nextIndex >= 0) return nextIndex;
    const previousIndex = tasks.findIndex(task => task.id === previous?.dataset.taskId);
    return previousIndex >= 0 ? previousIndex + 1 : tasks.length;
}

/**
 * Creates ordered status updates for a column's tasks.
 * @param {Task[]} tasks - Tasks in their desired order.
 * @param {string} status - The column status.
 * @returns {{task: Task, status: string, order: number}[]}
 */
function getStatusOrderUpdates(tasks, status) {
    return tasks.map((task, order) => ({ task, status, order }));
}

/**
 * Checks whether a task's status or position needs updating.
 * @param {{task: Task, status: string, order: number}} update - The proposed update.
 * @returns {boolean}
 */
function isTaskOrderUpdateNeeded({ task, status, order }) {
    return task.status !== status || task.order !== order;
}

/**
 * Persists a batch of task status and order changes.
 * @param {{task: Task, status: string, order: number}[]} updates - The changes to save.
 * @returns {Promise<void>}
 */
async function saveTaskOrderUpdates(updates) {
    await Promise.all(updates.map(({ task, status, order }) =>
        updateTask(task.id, { status, order })
    ));
}

/**
 * Finds the nearest task sibling in the given direction.
 * @param {Element} element - The element to search from.
 * @param {string} direction - The sibling property to follow.
 * @returns {Element|null}
 */
function getSiblingTask(element, direction) {
    let sibling = element[direction];
    while (sibling && !sibling.matches('.task')) sibling = sibling[direction];
    return sibling;
}

/**
 * Returns a status column's tasks in their stored order.
 * @param {string} status - The status to filter by.
 * @returns {Task[]}
 */
function getOrderedTasks(status) {
    return boardTasks
        .map((task, index) => ({ task, index }))
        .filter(({ task }) => (task.status || TASK_STATUS.todo) === status)
        .sort((first, second) =>
            getTaskOrder(first.task, first.index) - getTaskOrder(second.task, second.index)
        )
        .map(({ task }) => task);
}

/**
 * Returns a task's order or a fallback index for older tasks.
 * @param {Task} task - The task to inspect.
 * @param {number} [fallback=0] - The order to use when none is stored.
 * @returns {number}
 */
function getTaskOrder(task, fallback = 0) {
    return Number.isFinite(task.order) ? task.order : fallback;
}

/**
 * Removes the drag placeholder and resets drag state.
 * @returns {void}
 */
function finishDragging() {
    taskPlaceholder?.remove();
    draggedTaskElement?.classList.remove('dragging');
    draggedTaskId = null;
    draggedTaskElement = null;
    taskPlaceholder = null;
}

