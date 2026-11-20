/**
 * Returns the HTML for one task card.
 * @param {Task} task - The task shown by the card.
 * @param {string} taskTitle - The escaped task title.
 * @param {string} taskCategory - The category markup.
 * @param {string} taskDescription - The description markup.
 * @param {string} subtaskTemplate - The subtask progress markup.
 * @param {string} assignedUsersTemplate - The assigned-user markup.
 * @returns {string}
 */
function getTaskTemplate(task, taskTitle, taskCategory, taskDescription, subtaskTemplate, assignedUsersTemplate) {
    return `
        <article class="task" draggable="true" data-task-id="${task.id}" ondragstart="startDragging(event)" ondragend="finishDragging()">
            ${taskCategory}
            <h3>${taskTitle}</h3>
            ${taskDescription}
            ${subtaskTemplate}
            <div class="task-footer">
                <div class="assigned-users" aria-label="Assigned users">
                    ${assignedUsersTemplate}
                </div>
                <span class="task-priority-icon priority-${task.priority}" role="img" aria-label="${task.priority} priority"></span>
            </div>
        </article>
    `;
}

/**
 * Returns the HTML shown when a column has no visible tasks.
 * @param {string} columnTitle - The column heading.
 * @returns {string}
 */
function getNoTasksTemplate(columnTitle) {
    return `
        <p class="no-tasks">No tasks ${columnTitle}</p>
    `;
}

/**
 * Returns the category label markup.
 * @param {string} categoryClass - An optional category CSS class.
 * @param {string} categoryText - The category label.
 * @returns {string}
 */
function getCategoryTemplate(categoryClass, categoryText) {
    return `
        <span class="category-tag ${categoryClass}">${categoryText}</span>
    `;
}

/**
 * Returns the task description markup.
 * @param {string} description - The escaped description text.
 * @returns {string}
 */
function getDescriptionTemplate(description) {
    return `
        <p class="task-description">${description}</p>
    `;
}

/**
 * Returns the subtask progress markup.
 * @param {number} subtasksDone - The number of completed subtasks.
 * @param {number} subtaskCount - The total number of subtasks.
 * @param {number} progress - The completed percentage.
 * @returns {string}
 */
function getSubtaskTemplate(subtasksDone, subtaskCount, progress) {
    return `
        <div class="subtask-section">
            <div class="progress-bar" role="progressbar" aria-label="Subtask progress"
                aria-valuenow="${subtasksDone}" aria-valuemin="0" aria-valuemax="${subtaskCount}">
                <div class="progress" style="width:${progress}%"></div>
            </div>
            <span>${subtasksDone}/${subtaskCount} Subtasks</span>
        </div>
    `;
}

/**
 * Returns an assigned user's avatar markup.
 * @param {string} color - The avatar background color.
 * @param {string} name - The escaped user name.
 * @param {string} initials - The initials shown in the avatar.
 * @returns {string}
 */
function getAssignedUserTemplate(color, name, initials) {
    return `
        <span class="user-avatar" style="background:${color}"
        aria-label="${name}">${initials}</span>
    `;
}