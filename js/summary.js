/**
 * Loads the tasks from Firebase and shows the numbers on the summary.
 */
async function initSummary() {
    try {
        const tasks = await loadTasks();
        renderSummaryCounts(tasks);
    } catch (error) {
        console.error('Summary could not be loaded:', error);
    }
}


/**
 * Writes all numbers of the summary into the page.
 * @param {Task[]} tasks - All tasks.
 */
function renderSummaryCounts(tasks) {
    setSummaryValue('summaryToDoCount', countTasksByStatus(tasks, TASK_STATUS.todo));
    setSummaryValue('summaryDoneCount', countTasksByStatus(tasks, TASK_STATUS.done));
    setSummaryValue('summaryTasksInProgressCount', countTasksByStatus(tasks, TASK_STATUS.inProgress));
    setSummaryValue('summaryAwaitingFeedbackCount', countTasksByStatus(tasks, TASK_STATUS.awaitFeedback));
    setSummaryValue('summaryTasksInBoardsCount', tasks.length);
    setSummaryValue('summaryUrgentCount', getOpenUrgentTasks(tasks).length);
}


/**
 * Counts the tasks with the given status.
 * @param {Task[]} tasks - All tasks.
 * @param {string} status - A value from TASK_STATUS.
 * @returns {number} The number of tasks with this status.
 */
function countTasksByStatus(tasks, status) {
    let count = 0;
    for (const task of tasks) {
        if (task.status === status) count++;
    }
    return count;
}


/**
 * Returns the urgent tasks that are not done yet.
 * @param {Task[]} tasks - All tasks.
 * @returns {Task[]} The open urgent tasks.
 */
function getOpenUrgentTasks(tasks) {
    const result = [];
    for (const task of tasks) {
        const isUrgent = task.priority === TASK_PRIORITY.urgent;
        const isDone = task.status === TASK_STATUS.done;
        if (isUrgent && !isDone) result.push(task);
    }
    return result;
}


/**
 * Writes a value into an element of the summary.
 * @param {string} id - The id of the element.
 * @param {number|string} value - The value to show.
 */
function setSummaryValue(id, value) {
    document.getElementById(id).textContent = value;
}
