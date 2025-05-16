describe("Todo Application", () => {
  beforeEach(() => {
    // Visit the app
    cy.visit("http://localhost:3000/");
    cy.clearLocalStorage(); // Reset state before each test
  });

  it("should display the todo app title", () => {
    cy.contains("h1", "To-Do List").should("be.visible");
  });

  it("should create a basic task", () => {
    cy.get('input[placeholder="Task title"]').type("Buy groceries");
    cy.get('textarea[placeholder="Task description"]').type(
      "Need milk, eggs, and bread"
    );
    cy.get("button").contains("Add Task").click();
    cy.wait(2000);
    cy.contains("Buy groceries").should("be.visible");
    cy.contains("Need milk, eggs, and bread").should("be.visible");
  });

  it("should create a timed task", () => {
    cy.get('[data-testid="task-type-select"]').select("Timed");

    cy.get('input[placeholder="Task title"]').type("Dentist appointment");
    cy.get('textarea[placeholder="Task description"]').type("Annual checkup");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(2, 0, 0, 0);
    const pad = (n: number) => n.toString().padStart(2, "0");
    const dateStr = `${tomorrow.getFullYear()}-${pad(
      tomorrow.getMonth() + 1
    )}-${pad(tomorrow.getDate())}T${pad(tomorrow.getHours())}:${pad(
      tomorrow.getMinutes()
    )}`;

    cy.get('input[type="datetime-local"]').type(dateStr);
    cy.get("button").contains("Add Task").click();

    cy.contains("Dentist appointment").should("be.visible");
    cy.contains("Annual checkup").should("be.visible");

    const displayDate = `Due: ${tomorrow.toLocaleString("en-PH", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    })}`;
    cy.contains(displayDate).should("exist");
  });

  it("should display CheckCircle icon for completed tasks", () => {
    cy.get('input[placeholder="Task title"]').type("Task with Icon");
    cy.get("button").contains("Add Task").click();

    cy.contains("Task with Icon")
      .parent()
      .parent()
      .find("button")
      .contains("Complete")
      .click();

    cy.contains("Task with Icon")
      .parent()
      .parent()
      .find("svg")
      .should("exist")
      .parent()
      .should("have.class", "text-green-500");
  });

  it("should show notification for overdue tasks", () => {
    cy.get('[data-testid="task-type-select"]').select("Timed");
    cy.get('input[placeholder="Task title"]').type("Overdue Task");

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(10, 0, 0, 0);
    const dateStr = yesterday.toISOString().slice(0, 16);
    cy.get('input[type="datetime-local"]').type(dateStr);

    cy.get("button").contains("Add Task").click();
    cy.reload();

    cy.get(".space-y-2").should("exist");
    cy.contains("Overdue Task").should("be.visible");
    cy.contains("is overdue").should("be.visible");
  });

  it("should delete a task", () => {
    cy.get('input[placeholder="Task title"]').type("Task to delete");
    cy.get("button").contains("Add Task").click();

    cy.contains("Task to delete")
      .closest('[data-testid="task-item"]')
      .find('[data-testid="delete-button"]')
      .click();

    cy.contains("Task to delete").should("not.exist");
  });

  // === SORTING TESTS ===

  it("should sort tasks by Name", () => {
    cy.get('input[placeholder="Task title"]').type("Banana");
    cy.get("button").contains("Add Task").click();

    cy.get('input[placeholder="Task title"]').clear().type("Apple");
    cy.get("button").contains("Add Task").click();

    cy.get('input[placeholder="Task title"]').clear().type("Carrot");
    cy.get("button").contains("Add Task").click();

    cy.get('[data-testid="sort-select"]').select("sortByName");

    cy.get('[data-testid="task-item"]')
      .then((items) => {
        expect(items[0]).to.contain.text("Apple");
        expect(items[1]).to.contain.text("Banana");
        expect(items[2]).to.contain.text("Carrot");
      });
  });

  it("should sort tasks by Due Date", () => {
    // Create two timed tasks with different due dates
    cy.get('[data-testid="task-type-select"]').select("Timed");
    const now = new Date();
    const future = new Date(now);
    future.setDate(future.getDate() + 2);

    const toInputDate = (date: Date) =>
      date.toISOString().slice(0, 16);

    cy.get('input[placeholder="Task title"]').type("Later Task");
    cy.get('input[type="datetime-local"]').type(toInputDate(future));
    cy.get("button").contains("Add Task").click();

    cy.get('[data-testid="task-type-select"]').select("Timed");
    cy.get('input[placeholder="Task title"]').type("Sooner Task");
    cy.get('input[type="datetime-local"]').type(toInputDate(now));
    cy.get("button").contains("Add Task").click();

    cy.get('[data-testid="sort-select"]').select("sortByDate");

    cy.get('[data-testid="task-item"]')
      .then((items) => {
        expect(items[0]).to.contain.text("Sooner Task");
        expect(items[1]).to.contain.text("Later Task");
      });
  });

  it("should sort tasks by Completion status", () => {
    cy.get('input[placeholder="Task title"]').type("Done Task");
    cy.get("button").contains("Add Task").click();
    cy.contains("Done Task").parent().parent().contains("Complete").click();

    cy.get('input[placeholder="Task title"]').clear().type("Pending Task");
    cy.get("button").contains("Add Task").click();

    cy.get('[data-testid="sort-select"]').select("sortByCompletion");

    cy.get('[data-testid="task-item"]')
      .then((items) => {
        expect(items[0]).to.contain.text("Pending Task");
        expect(items[1]).to.contain.text("Done Task");
      });
  });

  it("adds a checklist task with subtasks successfully", () => {
    // Select 'Checklist' task type
    cy.get('select[data-testid="task-type-select"]').select('checklist');

    // Subtask input should appear
    cy.get('input[placeholder="Enter sub-task"]').should("be.visible");

    // Add first subtask
    cy.get('input[placeholder="Enter sub-task"]').type("Subtask 1");
    cy.contains("button", "Add").click();
    cy.contains("li", "Subtask 1").should("exist");

    // Add second subtask
    cy.get('input[placeholder="Enter sub-task"]').type("Subtask 2");
    cy.contains("button", "Add").click();
    cy.contains("li", "Subtask 2").should("exist");

    // Fill in the main task title
    cy.get('input[placeholder="Task title"]').type("My Checklist Task");

    // Optionally fill in description
    cy.get('textarea[placeholder="Task description"]').type("This task has subtasks.");

    // Click Add Task button to submit
    cy.contains("button", "Add Task").click();

    // Confirm new task is added to the list with the title
    cy.contains("My Checklist Task").should("exist");

    // Optionally confirm subtasks are shown in task list — depends on your TaskFactory UI
    cy.contains("My Checklist Task")
      .parent() // Adjust this selector as needed to find subtasks list
      .within(() => {
        cy.contains("Subtask 1").should("exist");
        cy.contains("Subtask 2").should("exist");
      });
  });
});

