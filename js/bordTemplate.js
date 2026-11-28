function createBoardTemplate() {
    return `
    <div class="board">
    <img src="../assets/icons/bord-logo.svg" alt="">
    </div>
    `;
}

function getaddTaskTemplate() {
    return `
    <div class="add-task">
        <form class="form-section">
            <section class="form-section-left">
                <div class="form-group-title">
                    <span>
                        Title <span class="form-section-footer-required-star">*</span>
                    </span>
                    <div class="form-group">
                        <input
                            class="form-group-text"
                            type="text"
                            placeholder="Enter task title"
                            id="taskTitle"
                            name="taskTitle"
                            required
                        />
                    </div>
                </div>

                <div class="form-group-title-textarea">
                    Description
                    <div class="form-group">
                        <textarea
                            class="form-group-textarea"
                            id="taskDescription"
                            placeholder="Enter task description"
                            name="taskDescription"
                            required
                        ></textarea>
                    </div>
                </div>

                <div class="form-group-title-date">
                    <span>
                        Due Date <span class="form-section-footer-required-star">*</span>
                    </span>
                    <div class="form-group"> <input  class="form-group-text-date" type="text" placeholder="dd/mm/yyyy" id="taskDueDate" name="taskDueDate" required/>
                    </div>
                </div>
                <span
                    class="error-msg"
                    id="loginEmailError"
                    aria-live="polite"
                ></span>
            </section>

            <div class="separator-bottom"></div>
            <section class="form-section-right">
                <section class="form-group-title">
                    Priority
                    <div class="form-group-priority">
                        <button class="priority-button-urgent" type="button"id="taskPriorityLow">
                            Urgent <img src="../assets/icons/up.svg" alt="Up" />
                        </button>
                        <button class="priority-button-medium" type="button"id="taskPriorityMedium">
                            Medium <img src="../assets/icons/medium.svg" alt="Medium" />
                        </button>
                        <button
                            class="priority-button-low"
                            type="button"
                            id="taskPriorityHigh"
                        >
                            Low <img src="../assets/icons/Prio baja.svg" alt="Prio" />
                        </button>
                    </div>
                </section>

                <section class="form-group-assigned">
                    Assigned to
                    <div class="form-group-assigned-select">
                        <select
                            class="form-group-text-assigned"
                            id="taskAssigned"
                            name="taskAssigned"
                            required
                        >
                            <option value="">Select contacts to assign</option>
                        </select>
                    </div>
                </section>

                <section class="form-group-status">
                    <span>
                        Category <span class="form-section-footer-required-star">*</span>
                    </span>
                    <div class="form-group-status">
                        <select
                            class="form-group-text-assigned"
                            id="taskCategory"
                            name="taskCategory"
                            required
                        >
                            <option value="">Select category task category</option>
                        </select>
                    </div>
                </section>

                <section class="form-group-deadline">
                    Subtask
                    <div class="form-group-deadline">
                        <input
                            class="form-group-text-assigned"
                            type="text"
                            placeholder="Enter subtask"
                            id="taskSubtask"
                            name="taskSubtask"
                            required
                        />
                    </div>
                </section>
            </section>
        <section class="form-section-footer">
            <div class="form-section-footer-required">
                <span>
                    <span class="form-section-footer-required-star">*</span>
                    This field is required
                </span>
            </div>
            <section class="form-section-footer-buttons">
                <button type="button" onclick="clearForm()" class="form-section-footer-clear">clear X</button>
                <button type="submit"  onclick="gotoBoard()" class="form-section-footer-button">Create Task  <img class="summary-to-do-create" src="../assets/icons/done.svg" alt="Done Icon"/></button>
            </section>
        </section>
        </form>

    </div>
    `;
}