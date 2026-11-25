const MORNING_END_HOUR = 12; // "Good morning" until 12:00
const AFTERNOON_END_HOUR = 18; // "Good afternoon" until 18:00, then "Good evening"


/**
 * Shows the greeting, loads the tasks from Firebase and shows the numbers and the next deadline.
 */
async function initSummary() {
    renderGreeting();
    try {
        const tasks = await loadTasks();
        renderSummaryCounts(tasks);
        renderSummaryDeadline(tasks);
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


/**
 * Shows the earliest due date of all open urgent tasks.
 * @param {Task[]} tasks - All tasks.
 */
function renderSummaryDeadline(tasks) {
    const dueDate = getEarliestDueDate(getOpenUrgentTasks(tasks));
    setSummaryValue('summaryDeadline', formatDueDate(dueDate));
}


/**
 * Finds the earliest due date of the given tasks.
 * Dates as "YYYY-MM-DD" can be compared like normal text.
 * @param {Task[]} tasks - The tasks to check.
 * @returns {string} The earliest due date, or "" if no task has one.
 */
function getEarliestDueDate(tasks) {
    let earliest = '';
    for (const task of tasks) {
        if (!task.dueDate) continue;
        if (earliest === '' || task.dueDate < earliest) earliest = task.dueDate;
    }
    return earliest;
}


/**
 * Turns "2026-12-04" into "December 4, 2026".
 * @param {string} dueDate - The date as "YYYY-MM-DD", or "".
 * @returns {string} The readable date, or a text if there is no date.
 */
function formatDueDate(dueDate) {
    if (!dueDate) return 'No upcoming deadline';
    const parts = dueDate.split('-');
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}


/**
 * Shows the greeting for the time of day and the name of the user.
 * The guest only gets the greeting without a name.
 */
function renderGreeting() {
    const user = getSession();
    let greeting = getGreetingText(new Date().getHours());
    let name = '';
    if (user && !user.isGuest) {
        greeting = greeting + ',';
        name = user.name;
    }
    setSummaryValue('summaryGreeting', greeting);
    setSummaryValue('summaryUserName', name);
}


/**
 * Returns the greeting for the given hour.
 * @param {number} hour - The hour of the day, 0 to 23.
 * @returns {string} "Good morning", "Good afternoon" or "Good evening".
 */
function getGreetingText(hour) {
    if (hour < MORNING_END_HOUR) return 'Good morning';
    if (hour < AFTERNOON_END_HOUR) return 'Good afternoon';
    return 'Good evening';
}
