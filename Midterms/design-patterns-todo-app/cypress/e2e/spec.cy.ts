// cypress/e2e/todo.cy.js

describe("Todo Application", () => {
  beforeEach(() => {
    // Visit the app
    cy.visit("http://localhost:3000/");
  });

  it("should display the todo app title", () => {
    cy.contains("h1", "To-Do List").should("be.visible");
  });

  it("should create a basic task", () => {
    // Fill in task details
    cy.get('input[placeholder="Task title"]').type("Buy groceries");
    cy.get('textarea[placeholder="Task description"]').type(
      "Need milk, eggs, and bread"
    );
    cy.get("button").contains("Add Task").click();

    // Verify task appears in the list
    cy.contains("Buy groceries").should("be.visible");
    cy.contains("Need milk, eggs, and bread").should("be.visible");
  });

  it("should create a timed task", () => {
    // Select timed task type
    cy.get('[data-testid="task-type-select"]').select("Timed");

    // Fill in task details
    cy.get('input[placeholder="Task title"]').type("Dentist appointment");
    cy.get('textarea[placeholder="Task description"]').type("Annual checkup");

    // Set due date (tomorrow at 2:00 AM)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(2, 0, 0, 0);

    // Generate a local datetime string in `YYYY-MM-DDTHH:mm` format
    const pad = (n: number) => n.toString().padStart(2, "0");
    const dateStr = `${tomorrow.getFullYear()}-${pad(
      tomorrow.getMonth() + 1
    )}-${pad(tomorrow.getDate())}T${pad(tomorrow.getHours())}:${pad(
      tomorrow.getMinutes()
    )}`;

    cy.get('input[type="datetime-local"]').type(dateStr);

    cy.get("button").contains("Add Task").click();

    // Verify task appears in the list
    cy.contains("Dentist appointment").should("be.visible");
    cy.contains("Annual checkup").should("be.visible");

    // Verify the date is displayed
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
    // Create a basic task
    cy.get('input[placeholder="Task title"]').type("Task with Icon");
    cy.get("button").contains("Add Task").click();

    // Complete the task
    cy.contains("Task with Icon")
      .parent()
      .parent()
      .find("button")
      .contains("Complete")
      .click();

    // Check for the CheckCircle icon
    cy.contains("Task with Icon")
      .parent()
      .parent()
      .find("svg")
      .should("exist")
      .parent()
      .should("have.class", "text-green-500");
  });
  it("should show notification for overdue tasks", () => {
    // Create a timed task with a due date in the past
    cy.get('[data-testid="task-type-select"]').select("Timed");
    cy.get('input[placeholder="Task title"]').type("Overdue Task");

    // Set due date (yesterday)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(10, 0, 0, 0);
    const dateStr = yesterday.toISOString().slice(0, 16);
    cy.get('input[type="datetime-local"]').type(dateStr);

    cy.get("button").contains("Add Task").click();

    // Reload the page to trigger notifications check
    cy.reload();

    // Verify notification about overdue task is displayed
    cy.get(".space-y-2").should("exist");
    cy.contains("Overdue Task").should("be.visible");
    cy.contains("is overdue").should("be.visible");
  });

  it("should delete a task", () => {
    // Create a basic task
    cy.get('input[placeholder="Task title"]').type("Task to delete");
    cy.get("button").contains("Add Task").click();

    // Delete the task

    cy.contains("Task to delete")
      .closest('[data-testid="task-item"]')
      .find('[data-testid="delete-button"]')
      .click();

    cy.contains("Task to delete").should("not.exist");
  });
});
