/**
 * Test: adds a demo task and shows it in the console.
 */
async function addTaskTest() {
    const task = await addDemoTask();
    console.log('Task added:', task.title, task);
}
